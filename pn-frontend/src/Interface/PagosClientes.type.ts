export interface CreatePagoCliente {
    idPagoCliente?: number;
    valor?: number;
    numeroRecibo?: string;
    comprobante?: string;
    tipoPago?: string;
    aplicarPagoDTO: AplicarPagoDTO[];
}

export interface AplicarPagoDTO {
    valor?: number | null;
    idFacturacion?: number | null;
    fechaPago?: Date | null;
}
