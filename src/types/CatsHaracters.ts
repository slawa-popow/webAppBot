
export interface CatsHaracters {
    categories: string[];
    brands: {[key: string]: string[]};
    characteristics: {
        [key: string]: string[];
    };
}