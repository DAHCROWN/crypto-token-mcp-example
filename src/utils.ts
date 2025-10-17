const BILLION = 1000000000;
const MILLION = 1000000;
const THOUSAND = 1000;

export function formatNumber(num: number): string {
	if (num >= BILLION) {
		return (num / BILLION).toFixed(1) + "B";
	} else if (num >= MILLION) {
		return (num / MILLION).toFixed(1) + "M";
	} else if (num >= THOUSAND) {
		return (num / THOUSAND).toFixed(1) + "k";
	} else {
		return num.toString();
	}
}
