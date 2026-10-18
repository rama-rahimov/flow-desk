export function TrModal({handleDelete, setIsModalTrOpen, setIsModalOpen}){
    return (
    <div className="modal-overlay" onClick={() => setIsModalTrOpen(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h2>Which change do you want to do with this product ?</h2>
                <button className="modal-close" onClick={() => setIsModalTrOpen(false)}>×</button>
            </div>
            <h2></h2>
            <div>
                <button className="products-delete-button" onClick={handleDelete}>Delete</button>
                <button className="products-add-button" onClick={() => {setIsModalTrOpen(false); setIsModalOpen(true)}}>Edit</button>
            </div>
        </div>
    </div>)
}