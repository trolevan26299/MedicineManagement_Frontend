const CommonImages = {
  get(iconKey, color = '#121F43', option) {
    let data = ImageData?.[iconKey]?.(color, option);
    return data ? `data:image/svg+xml;utf8,${encodeURIComponent(data)}` : undefined;
  },
};

export default CommonImages;

const ImageData = {
  calendar: (color) =>
    `<svg width='14' height='16' viewBox='0 0 14 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M4.75 7.25H3.25V8.75H4.75V7.25ZM7.75 7.25H6.25V8.75H7.75V7.25ZM10.75 7.25H9.25V8.75H10.75V7.25ZM12.25 2H11.5V0.5H10V2H4V0.5H2.5V2H1.75C0.9175 2 0.2575 2.675 0.2575 3.5L0.25 14C0.25 14.825 0.9175 15.5 1.75 15.5H12.25C13.075 15.5 13.75 14.825 13.75 14V3.5C13.75 2.675 13.075 2 12.25 2ZM12.25 14H1.75V5.75H12.25V14Z' fill='${color}'/>
      </svg>`,
};
