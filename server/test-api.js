const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const log = (step, success, msg, data) => {
  const symbol = success ? '✅' : '❌';
  console.log(`[${step}] ${symbol} ${msg}`);
  if (data) console.log(JSON.stringify(data, null, 2));
  console.log('------------------------------------------------');
};

async function runTests() {
  console.log('🚀 Starting Bento Link Hub API Tests...\n');
  let token = '';
  let linkId = '';
  const email = `admin_${Date.now()}@bento.com`;
  const password = 'securepassword123';

  // 1. Register User
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.status === 201) {
      log('Register User', true, 'Successfully registered new admin user', data);
    } else {
      log('Register User', false, `Registration failed with status ${res.status}`, data);
      return;
    }
  } catch (err) {
    log('Register User', false, `Connection error: ${err.message}`);
    return;
  }

  // 2. Login User
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.status === 200 && data.token) {
      token = data.token;
      log('Login User', true, 'Successfully logged in. Token acquired.', { email, token: `${token.substring(0, 20)}...` });
    } else {
      log('Login User', false, `Login failed with status ${res.status}`, data);
      return;
    }
  } catch (err) {
    log('Login User', false, `Connection error: ${err.message}`);
    return;
  }

  // 3. Create Link WITHOUT JWT (Should fail - 401)
  try {
    const res = await fetch(`${BASE_URL}/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Google', url: 'https://google.com', gridSpanX: 2, gridSpanY: 1 })
    });
    const data = await res.json();
    if (res.status === 401) {
      log('Create Link No Auth', true, 'Successfully rejected unauthorized creation request (HTTP 401)', data);
    } else {
      log('Create Link No Auth', false, `Failed: Expected 401 but got ${res.status}`, data);
    }
  } catch (err) {
    log('Create Link No Auth', false, `Connection error: ${err.message}`);
  }

  // 4. Create Link WITH JWT (Should succeed - 201)
  try {
    const res = await fetch(`${BASE_URL}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: 'My Portfolio', url: 'https://myportfolio.dev', gridSpanX: 2, gridSpanY: 2 })
    });
    const data = await res.json();
    if (res.status === 201) {
      linkId = data._id;
      log('Create Link With Auth', true, 'Successfully created a new link (HTTP 201)', data);
    } else {
      log('Create Link With Auth', false, `Failed to create link with status ${res.status}`, data);
      return;
    }
  } catch (err) {
    log('Create Link With Auth', false, `Connection error: ${err.message}`);
    return;
  }

  // 5. Get All Links (Should succeed - 200)
  try {
    const res = await fetch(`${BASE_URL}/links`);
    const data = await res.json();
    if (res.status === 200 && Array.isArray(data)) {
      log('Get All Links', true, `Successfully fetched all links. Count: ${data.length}`, data);
    } else {
      log('Get All Links', false, `Failed to fetch links with status ${res.status}`, data);
    }
  } catch (err) {
    log('Get All Links', false, `Connection error: ${err.message}`);
  }

  // 6. Click Link (Atomically increment clickCount) (Should succeed - 200)
  try {
    const res = await fetch(`${BASE_URL}/links/click/${linkId}`, {
      method: 'PATCH'
    });
    const data = await res.json();
    if (res.status === 200 && data.clickCount === 1) {
      log('Click Link (Increment)', true, 'Successfully registered click and incremented count to 1', data);
    } else {
      log('Click Link (Increment)', false, `Failed with status ${res.status} or unexpected clickCount`, data);
    }
  } catch (err) {
    log('Click Link (Increment)', false, `Connection error: ${err.message}`);
  }

  // 7. Delete Link WITH JWT (Should succeed - 200)
  try {
    const res = await fetch(`${BASE_URL}/links/${linkId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (res.status === 200) {
      log('Delete Link', true, 'Successfully deleted link with JWT authentication', data);
    } else {
      log('Delete Link', false, `Failed to delete link with status ${res.status}`, data);
    }
  } catch (err) {
    log('Delete Link', false, `Connection error: ${err.message}`);
  }

  // 8. Verify Link Deleted
  try {
    const res = await fetch(`${BASE_URL}/links`);
    const data = await res.json();
    const exists = data.some(l => l._id === linkId);
    if (res.status === 200 && !exists) {
      log('Verify Deletion', true, 'Confirmed link was successfully removed from database');
    } else {
      log('Verify Deletion', false, 'Failed: Link is still present in database after delete operation');
    }
  } catch (err) {
    log('Verify Deletion', false, `Connection error: ${err.message}`);
  }

  console.log('🏁 Bento Link Hub API Tests Completed.');
}

runTests();
