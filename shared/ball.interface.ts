import {Color} from "./colors.enum";

export interface Ball {
    x: number;
    y: number;
    color: Color;
    radius: number;
    name?: string;
}