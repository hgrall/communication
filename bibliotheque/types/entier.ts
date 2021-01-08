/*
* number : nombres à virgule flottante.
*/

interface FormatDivisionEuclidienne {
    quotient: number;
    reste: number
}

export function divEuclidienne(p: number, q: number): FormatDivisionEuclidienne {
    return {
        quotient: Math.floor(p / q),
        reste: p % q
    };
}