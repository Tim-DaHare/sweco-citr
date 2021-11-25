export interface Requirement {
    id: string | null, 
    status: string | null, 
    description: string | null,
    type?: string // 'Klanteis' | 'Contracteis_product' | 'Systeemeis'
}