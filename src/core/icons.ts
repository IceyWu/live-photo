export const arrowIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z"/></svg>
`;

export const errorIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m3.5 3.5l9 9m2-4.5a6.5 6.5 0 1 1-13 0a6.5 6.5 0 0 1 13 0Z"/></svg>
 `;

export const volumeOnIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
`;

export const volumeOffIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
`;

export const autoplayOnIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 9l5 3l-5 3z" fill="currentColor" stroke="none"/></svg>
`;

export const autoplayOffIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 9l5 3l-5 3z" fill="currentColor" stroke="none"/><line x1="4" y1="4" x2="20" y2="20"/></svg>
`;

// 模块级预计算：12 个外圈圆点坐标，只算一次
const ICON_SIZE = 12;
const CENTER = ICON_SIZE / 2;
const OUTER_CIRCLE_RADIUS = 5;
const TOTAL_DOTS = 12;
const OUTER_DOT_RADIUS = 0.3;
const CENTER_DOT_RADIUS = 1;
const INNER_CIRCLE_RADIUS = 3;
const INNER_CIRCLE_STROKE = 1;

const DOT_COORDS: { x: number; y: number }[] = Array.from({ length: TOTAL_DOTS }, (_, i) => {
  const angle = (i * 2 * Math.PI) / TOTAL_DOTS;
  return {
    x: parseFloat((CENTER + OUTER_CIRCLE_RADIUS * Math.sin(angle)).toFixed(4)),
    y: parseFloat((CENTER - OUTER_CIRCLE_RADIUS * Math.cos(angle)).toFixed(4)),
  };
});

export const createProgressLiveIcon = (progress: number, showSlash: boolean = false) => {
  const dots = DOT_COORDS.map((pos, i) => {
    const opacity = i / TOTAL_DOTS <= progress / 100 ? '1' : '0.2';
    return `<circle cx="${pos.x}" cy="${pos.y}" r="${OUTER_DOT_RADIUS}" fill="currentColor" opacity="${opacity}" />`;
  }).join('');

  const slash = showSlash ? `<path d="M1 11L11 1" stroke="currentColor" stroke-width="1.5"/>` : '';

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 ${ICON_SIZE} ${ICON_SIZE}">
    <g fill="none" stroke="currentColor" stroke-width="${INNER_CIRCLE_STROKE}">
      <circle cx="${CENTER}" cy="${CENTER}" r="${CENTER_DOT_RADIUS}" fill="currentColor"/>
      <circle cx="${CENTER}" cy="${CENTER}" r="${INNER_CIRCLE_RADIUS}" />
      ${dots}
      ${slash}
    </g>
  </svg>
`;
};
