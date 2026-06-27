import React from 'react';

const SkeletonGrid = () => {
  // Render a fixed set of dummy cards with different span sizes to mimic a bento layout
  const dummyItems = [
    { id: 1, x: 2, y: 2 },
    { id: 2, x: 1, y: 1 },
    { id: 3, x: 1, y: 2 },
    { id: 4, x: 2, y: 1 },
    { id: 5, x: 1, y: 1 },
    { id: 6, x: 3, y: 1 }
  ];

  return (
    <div className="bento-grid">
      {dummyItems.map((item) => (
        <div
          key={item.id}
          className="bento-card skeleton"
          style={{
            gridColumn: `span ${item.x}`,
            gridRow: `span ${item.y}`
          }}
        >
          <div className="skeleton-line title"></div>
          <div className="skeleton-line url"></div>
          <div className="skeleton-badge"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonGrid;
