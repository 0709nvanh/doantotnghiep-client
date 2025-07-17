import { useParams } from 'react-router-dom';

const HistoryDetail = () => {
    const {id} = useParams()
    console.log(id);
    
    return (
        <div>
            
        </div>
    )
}

export default HistoryDetail
