export class ColorsService {
  static convert3HexTo6(themeColor: string): string {
    if (typeof themeColor === 'string') {
      const isHexColor = /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(themeColor);
      if (isHexColor && themeColor.length === 4) {
        return themeColor.replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3');
      }
    }
    return themeColor;
  }
}
