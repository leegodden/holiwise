// CreateFolderModal.tsx

import React, { useState } from 'react';
import Modal from 'react-modal';
import { IoCloseCircleOutline } from 'react-icons/io5';

interface CreateFolderModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (folderName: string) => void;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
	isOpen,
	onClose,
	onCreate,
}) => {
	const [folderName, setFolderName] = useState('');

	const handleCreateFolder = () => {
		if (folderName.trim()) {
			// Ensure folder name is not empty
			onCreate(folderName);
			setFolderName('');
			onClose();
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && folderName.trim() !== '') {
			onCreate(folderName);
			onClose();
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			contentLabel='Create Folder'
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
					transform: 'translate(-50%, -50%)',
					backgroundColor: '#fbf7f7',
					padding: '0px',
					border: 'none',
					borderRadius: '12px',
					width: '250px;',
					maxHeight: '250px',
					textAlign: 'left',
				},
			}}
		>
			<div style={{ position: 'relative' }}>
				<div
					style={{
						backgroundColor: '#36393b',
						height: '40px',
						color: '#fff',
						padding: '10px 30px',
						borderRadius: '12px 12px 0 0',
						textAlign: 'center',
						width: '100%',
						boxSizing: 'border-box',
					}}
				>
					<h2 style={{ margin: '0' }}>Create Folder</h2>
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
						value={folderName}
						onChange={(e) => setFolderName(e.target.value)}
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
						placeholder='Enter folder name'
					/>
					<button
						style={{
							margin: '0px',
							padding: '5px 15px',
							backgroundColor: '#A2DFFF',
							color: 'black',
							fontSize: '13px',
							border: 'none',
							borderRadius: '8px',
							cursor: 'pointer',
							width: '75px',
						}}
						onClick={handleCreateFolder}
					>
						Create
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default CreateFolderModal;
