// importando las working functions

import {
  removeSlice,
  countSlice,
  strToArr,
  arrToStr,
  updateInnerHTML,
} from "./svgMarkerUtilities.js";

// importando los logos svg

// import githubLogo from "../svg/githubLogo.svg";
// import jsLogo from "../svg/jsLogo.svg";

// objeto con las rutas de cada logo disponible
const svgLogos = {
  githubLogo: `<img class='svgIcon' src="/src/svgs/githubLogo.svg" alt="github logo"/>`,
  jsLogo: `<img class='svgIcon' src="/src/svgs/jsLogo.svg" alt="github logo"/>`,
};

// buscando / creando / simulando una lista de elementos html mediante objetos con la key de `innerHTML`
const svgContainers = document.querySelectorAll(".svg-container") || [
  { innerHTML: "hello world {svg:githubLogo} 0123456789" },
  { innerHTML: "bye world {svg:githubLogo} 0123456789" },
];

svgContainers.forEach((svgContainer) => {
  // encuentra tanto el principio como el final de la plantilla svg
  const targetStrSlice = "{svg:";
  const content = svgContainer.innerHTML;

  const targetSliceStartIndex =
    content.indexOf(targetStrSlice) !== -1
      ? content.indexOf(targetStrSlice) + targetStrSlice.length
      : content.indexOf(targetStrSlice);

  const targetSliceEndIndex =
    content.indexOf("}") !== -1
      ? content.indexOf("}") - 1
      : content.indexOf("}");

  // encuentra errores en la platilla svg
  if ([targetSliceStartIndex, targetSliceEndIndex].includes(-1))
    throw new Error("Bad svg template input into string !");

  // gets the name and the route of the svg
  const svgName = content.substring(
    targetSliceStartIndex,
    targetSliceEndIndex + 1
  );
  const svgRoute = svgLogos[svgName];
  if (!svgRoute)
    throw new Error(
      `\`${svgName}\` svg icon name does not exist. Try with other svg icon name !`
    );

  // replaces the svg template by the respective svgLogo route
  if (countSlice(content, targetStrSlice) > 1)
    throw new Error("To many svg icon template inside the same html tag");

  let svgNameStrTemplate = `{svg:${svgName}}`;
  let newContent = strToArr(content);
  newContent.splice(content.indexOf(targetStrSlice), 0, svgRoute);
  newContent = arrToStr(newContent);
  newContent = removeSlice(svgNameStrTemplate, newContent);

  // updates the inner content of each html element
  updateInnerHTML(svgContainer, newContent);
});
