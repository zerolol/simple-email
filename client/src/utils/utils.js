// 日期格式化
function addZero(num) {
  if (num < 10) return `0${num}`;
  return num;
}
export function formatDate(time) {
  if (Number.isNaN(time) || time === undefined) {
    return '';
  }
  const d = new Date(time * 1);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const hour = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  return `${year}-${month}-${date} ${addZero(hour)}:${addZero(minutes)}:${addZero(seconds)}`;
}

export function convertTime(time) {
  let h = Math.floor((time / 60 / 60) % 24);
  let m = Math.floor((time / 60) % 60);
  let s = Math.floor(time % 60);
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;
  h = h < 10 ? `0${h}` : h;
  return `${h}:${m}:${s}`;
}
