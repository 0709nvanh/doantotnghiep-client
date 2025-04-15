import React from 'react';
import { useParams } from 'react-router-dom';

interface Props {
    
}

const HistoryDetail = (props: Props) => {
    const {id} = useParams()
    console.log(id);
    
    return (
        <div>
            
        </div>
    )
}

export default HistoryDetail
