export const removeSlice = (slice, str) => {
  let newStr = str.split(slice);
  newStr = newStr.join("");
  return newStr;
};

export const countSlice = (wholeString, targetSlice) => {
  if (!targetSlice) return wholeString.length;
  return wholeString.split(targetSlice).length - 1;
};

export const strToArr = (str) => str.split("");

export const arrToStr = (arr) => arr.join("");

export const updateInnerHTML = (element, newValue) => {
  element.innerHTML = newValue;
};
