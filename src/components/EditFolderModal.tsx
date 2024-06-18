import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { IoCloseCircleOutline } from 'react-icons/io5';

interface EditFolderModalProps {
	isOpen: boolean;
	onClose: () => void;
	folderName: string;
	onRename: (newName: string) => void;
	onDelete: () => void;
}

const EditFolderModal: React.FC<EditFolderModalProps> = ({
	isOpen,
	onClose,
	folderName,
	onRename,
	onDelete,
}) => {
	const [editedName, setEditedName] = useState(folderName);

	const handleRename = () => {
		onRename(editedName);
		onClose(); // Close modal after renaming
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedName(e.target.value);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleRename();
		}
	};

	// Reset editedName when folderName changes (e.g., when opening modal for different folder)
	useEffect(() => {
		setEditedName(folderName);
	}, [folderName]);

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			contentLabel='Edit Folder'
			style={{
				overlay: {
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
				},
				content: {
					top: '25%',
					left: '50%',
					right: 'auto',
					bottom: 'auto',
					marginRight: '-50%',
					backgroundColor: '#fbf7f7',
					transform: 'translate(-50%, -50%)',
					padding: '0px',
					border: 'none',
					borderRadius: '12px',
					width: '320px',
					maxHeight: '550px',
					textAlign: 'left',
				},
			}}
		>
			<div style={{ position: 'relative' }}>
				<div
					style={{
						backgroundColor: '#36393b',
						height: '40px',
						padding: '10px 30px',
						borderRadius: '12px 12px 0 0',
						textAlign: 'center',
						width: '100%',
						color: '#fff',
						boxSizing: 'border-box',
					}}
				>
					<h2 style={{ margin: '0' }}>Edit Folder</h2>
					<div
						style={{
							position: 'absolute',
							top: '10px',
							right: '10px',
							cursor: 'pointer',
							color: '#aaa',
						}}
						onClick={onClose}
					>
						<IoCloseCircleOutline size={24} style={{ color: '#b1adad' }} />
					</div>
				</div>
				<div style={{ padding: '20px 30px', textAlign: 'left' }}>
					<input
						type='text'
						value={editedName}
						onChange={handleInputChange}
						onKeyPress={handleKeyPress}
						style={{
							marginBottom: '20px',
							padding: '8px',
							width: '100%',
							fontSize: '14px',
							height: '32px',
							boxSizing: 'border-box',
							borderRadius: '8px',
							border: '1px solid #ccc',
							textAlign: 'left',
						}}
					/>
					<br />
					<button
						style={{
							margin: '0px',
							padding: '5px',
							backgroundColor: '#A2DFFF',
							color: 'black',
							fontSize: '13px',
							border: 'none',
							borderRadius: '8px',
							cursor: 'pointer',
							width: '75px',
						}}
						onClick={handleRename}
					>
						Rename
					</button>
					<button
						style={{
							margin: '10px',
							padding: '5px',
							backgroundColor: '#aa2734',
							color: 'white',
							fontSize: '13px',
							border: 'none',
							borderRadius: '8px',
							cursor: 'pointer',
							width: '75px',
						}}
						onClick={onDelete}
					>
						Delete
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default EditFolderModal;
