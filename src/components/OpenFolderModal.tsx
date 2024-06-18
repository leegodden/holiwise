// OpenFolderModal.tsx
import React from 'react';
import Modal from 'react-modal';
import ImageDisplay from './ImageDisplay';
import { IoCloseCircleOutline } from 'react-icons/io5';

interface Images {
	id: string;
	src: string;
	name: string;
	likes: number;
}

interface Folder {
	id: string;
	name: string;
	images: Images[];
}

interface OpenFolderModalProps {
	isOpen: boolean;
	onClose: () => void;
	folder: Folder | null;
	handleLike: (id: string) => void;
}

const OpenFolderModal: React.FC<OpenFolderModalProps> = ({
	isOpen,
	onClose,
	folder,
	handleLike,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			contentLabel='Folder Images'
			style={{
				content: {
					margin: 'auto',
					width: '46%',
					minWidth: '315px',
					height: '50%',
					overflow: 'auto',
					backgroundColor: '#fbf7f7',
					padding: '0px',
					borderRadius: '12px',
				},
			}}
		>
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
			<div style={{ backgroundColor: '#36393b', color: 'white' }}>
				<h2 style={{ margin: '0px', padding: '10px', textAlign: 'center' }}>
					{folder?.name}
				</h2>
			</div>
			<div
				style={{
					display: 'flex',
					overflowX: 'auto',
					maxHeight: '70vh',
					padding: '10px',
				}}
			>
				{folder?.images.map((image, index) => (
					<div
						style={{
							flex: '0 0 auto',
							marginLeft: '2px',
							marginRight: '2px',
						}}
						key={image.id}
					>
						<ImageDisplay
							id={image.id}
							src={image.src}
							name={image.name}
							index={index}
							moveImage={() => {}}
							canDrag={false}
							likes={image.likes}
							onLike={handleLike}
						/>
					</div>
				))}
			</div>
		</Modal>
	);
};

export default OpenFolderModal;
