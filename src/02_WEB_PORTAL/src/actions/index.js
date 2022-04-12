export const setvalue=(n)=>{
    return {
        type:'SETVALUE',
        payload:n
    }
}

export const setplacename=()=>{
    return {
        type:'SETPLACE'
    }
}
export const setlayerlist=(list)=>{
    return{
        type:'SETLAYERLIST',
        payload:list
    }
}
export const setdownloadlayer=(layer)=>{
    return{
        type:'SETDOWNLOADLAYER',
        payload:layer
    }
}
export const setdownloadlayerdate=(downloaddate)=>{
    return{
        type:'SETDOWNLOADDATE',
        payload:downloaddate
    }
}
export const setdownloadlayerregion=(region)=>{
    return{
        type:'SETDOWNLOADREGION',
        payload:region
    }
}
export const setdownloadlayertype=(type)=>{
    return{
        type:'SETDOWNLOADTYPE',
        payload:type
    }
}
export const setcurrentlayer=(type)=>{
    return{
        type:'SETCURRENTLAYER',
        payload:type
    }
}
export const setrasterloader=(type)=>{
    return{
        type:'ENABLERASTER',
        payload:type
    }
}
export const disablerasterloader=(type)=>{
    return{
        type:'DISABLERASTER',
        payload:type
    }
}
export const setvectorloader=(type)=>{
    return{
        type:'ENABLEVECTOR',
        payload:type
    }
}
export const disablevectorloader=(type)=>{
    return{
        type:'DISABLEVECTOR',
        payload:type
    }
}


