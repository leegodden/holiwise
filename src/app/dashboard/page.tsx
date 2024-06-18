'use client';

import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Folder from '@/components/Folder';
import ImageDisplay, { IImageProps } from '@/components/ImageDisplay';
import Modal from 'react-modal';
import { IoCloseCircleOutline } from 'react-icons/io5';

interface Image {
	id: string;
	src: string;
	name: string;
	likes: number;
}

interface Folder {
	id: string;
	name: string;
	images: Image[];
}

const Dashboard: React.FC = () => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const [folders, setFolders] = useState<Folder[]>(() => {
		try {
			const savedFolders = localStorage.getItem('savedFolders');
			return savedFolders ? JSON.parse(savedFolders) : [];
		} catch (error) {
			console.error('Failed to parse folders from localStorage:', error);
			return [];
		}
	});

	const [openFolderData, setOpenFolderData] = useState<{
		folder: Folder | null;
		showModal: boolean;
	}>({ folder: null, showModal: false });

	useEffect(() => {
		try {
			localStorage.setItem('savedFolders', JSON.stringify(folders));
		} catch (error) {
			console.error('Failed to save folders to localStorage:', error);
		}
	}, [folders]);

	const handleLike = (folderId: string, imageId: string) => {
		setFolders((prevFolders) =>
			prevFolders.map((folder) =>
				folder.id === folderId
					? {
							...folder,
							images: folder.images.map((image) =>
								image.id === imageId ? { ...image, likes: image.likes + 1 } : image
							),
					  }
					: folder
			)
		);

		if (openFolderData.folder?.id === folderId) {
			setOpenFolderData((prevState) => ({
				...prevState,
				folder: {
					...prevState.folder!,
					images: prevState.folder!.images.map((image) =>
						image.id === imageId ? { ...image, likes: image.likes + 1 } : image
					),
				},
			}));
		}
	};

	const handleFolderClick = (folderId: string) => {
		const clickedFolder = folders.find((folder) => folder.id === folderId);
		if (clickedFolder) {
			setOpenFolderData({ folder: clickedFolder, showModal: true });
		}
	};

	const handleModalClose = () => {
		setOpenFolderData((prevState) => ({ ...prevState, showModal: false }));
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<div style={{ display: 'flex', minHeight: '100vh' }}>
				{/* Main content */}
				<div style={{ flex: 1 }}>
					<div style={{ textAlign: 'center', marginTop: '20px' }}>
						<h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'black' }}>
							Shared Folders
						</h1>
						<h3 style={{ color: '#837e7e' }}>
							Click on the folders to vote for destinations
						</h3>
					</div>

					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: '40px',
							marginLeft: '100px',
						}}
					>
						{isClient &&
							folders.length > 0 &&
							folders.map((folder, index) => (
								<Folder
									key={folder.id}
									id={folder.id}
									name={folder.name}
									index={index}
									onClick={() => handleFolderClick(folder.id)}
									moveFolder={() => {}}
									canDrag={false}
									onDropImage={() => {}}
									onEdit={() => {}}
									showEditIcon={false}
								/>
							))}
					</div>

					{/* Modal for displaying folder images */}
					<Modal
						isOpen={openFolderData.showModal}
						onRequestClose={handleModalClose}
						contentLabel='Folder Images'
						style={{
							content: {
								margin: 'auto',
								width: '46%',
								minWidth: '350px',
								height: '50%',
								overflow: 'auto',
								background: '#fdfafa',
								padding: '0px', // Override padding here
								borderRadius: '12px',
							},
						}}
					>
						<div className='closeButton' onClick={handleModalClose}>
							<IoCloseCircleOutline size={24} style={{ color: '#7d7c7c' }} />
						</div>
						<div style={{ backgroundColor: '#36393b', color: 'white' }}>
							<h2 style={{ margin: '0px', padding: '10px', textAlign: 'center' }}>
								{openFolderData.folder?.name}
							</h2>
						</div>
						<div
							style={{
								display: 'flex',
								overflowX: 'auto',
								maxHeight: '70vh',
								padding: '10px',
								justifyContent:
									openFolderData.folder?.images.length === 0
										? 'center'
										: 'flex-start', // Center content if no images
								alignItems: 'center', // Center vertically if no images
							}}
						>
							{openFolderData.folder?.images.length === 0 ? (
								<h3>No saved destinations here</h3> // Display message if no images
							) : (
								openFolderData.folder?.images.map((image, index) => (
									<div
										key={image.id} // Moved key to this div
										style={{
											flex: '0 0 auto',
											marginLeft: '2px',
											marginRight: '2px',
										}}
									>
										<ImageDisplay
											key={image.id}
											id={image.id}
											src={image.src}
											name={image.name}
											likes={image.likes}
											onLike={() => handleLike(openFolderData.folder!.id, image.id)}
											canDrag={false} // canDrag prop
											index={index} // index prop
											moveImage={() => {}} // Placeholder function for moveImage
										/>
									</div>
								))
							)}
						</div>
					</Modal>
				</div>
			</div>
		</DndProvider>
	);
};

export default Dashboard;
