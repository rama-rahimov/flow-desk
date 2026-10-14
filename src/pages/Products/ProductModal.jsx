export function ProductModal({handleSubmit, handleChange, form, setIsModalOpen, title='Edit'}){
    return (
        <div className="modal-overlay">
            <div className="product-modal">
                <div className="modal-header">
                    <h2>{title} Product</h2>
                    <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name
                        <input
                            id="name"
                            value={form?.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Description
                        <textarea
                            id="description"
                            value={form?.description}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Price
                        <input
                            type="text"
                            id="price"
                            value={form?.price}
                            onChange={handleChange}
                            inputMode="decimal"
                            required
                        />
                    </label>
                    <div className="modal-actions">
                        <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" onClick={handleSubmit}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}