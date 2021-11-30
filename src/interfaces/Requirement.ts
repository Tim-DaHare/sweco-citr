export interface Requirement {
    id: string | null, 
    object_id:string | null, 
    status: string | null, 
    description: string | null,
    title: string | null,
    type: string // 'Klanteis' | 'Contracteis_product' | 'Systeemeis'
}