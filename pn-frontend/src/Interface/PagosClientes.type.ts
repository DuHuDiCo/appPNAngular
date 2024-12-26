export interface CreatePagoCliente {
    idPagoCliente: number;
    valor: number;
    numeroRecibo: string;
    comprobante: string;
    tipoPago: string;
    aplicarPagoDTO: AplicarPagoDTO[];
}

export interface AplicarPagoDTO {
    valor: number;
    idFacturacion: number;
    fechaPago: Date;
}
