'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import Folder from '@/components/Folder';
import ImageDisplay from '@/components/ImageDisplay';
import CreateFolderModal from '@/components/CreateFolderModal';
import EditFolderModal from '@/components/EditFolderModal';
import OpenFolderModal from '@/components/OpenFolderModal';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import { MdCardTravel } from 'react-icons/md';
import './globals.css';

const imageType = 'DraggableImage';

interface Images {
	id: string;
	src: string;
	name: string;
	likes: number;
}

const Page: React.FC = () => {
	const [isClient, setIsClient] = useState(false);
	const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);

	// hydration using local storage
	useEffect(() => {
		setIsClient(true);
	}, []);

	const [images, setImages] = useState<Images[]>(() => {
		try {
			const savedImages = localStorage.getItem('savedImages');
			return savedImages
				? JSON.parse(savedImages)
				: [
						{
							id: '1',
							src: 'assets/images/croatia.jpg',
							name: 'Dubrovnik, Croatia',
							likes: 0,
						},
						{
							id: '2',
							src: 'assets/images/corfu.jpg',
							name: 'Corfu, Greece',
							likes: 0,
						},
						{
							id: '3',
							src: 'assets/images/malaga.jpg',
							name: 'Malaga, Spain',
							likes: 0,
						},
				  ];
		} catch (error) {
			console.error('Failed to parse images from localStorage:', error);
			return [];
		}
	});

	const [folders, setFolders] = useState<
		Array<{ id: string; name: string; images: Images[] }>
	>(() => {
		try {
			const savedFolders = localStorage.getItem('savedFolders');
			return savedFolders ? JSON.parse(savedFolders) : [];
		} catch (error) {
			console.error('Failed to parse folders from localStorage:', error);
			return [];
		}
	});

	const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
	const [editFolderData, setEditFolderData] = useState<{
		id: string;
		name: string;
	} | null>(null);

	const [openFolderData, setOpenFolderData] = useState<{
		folder: {
			id: string;
			name: string;
			images: Images[];
		} | null;
		showModal: boolean;
	}>({ folder: null, showModal: false });

	useEffect(() => {
		try {
			localStorage.setItem('savedImages', JSON.stringify(images));
		} catch (error) {
			console.error('Failed to save images to localStorage:', error);
		}
		try {
			localStorage.setItem('savedFolders', JSON.stringify(folders));
		} catch (error) {
			console.error('Failed to save folders to localStorage:', error);
		}
	}, [images, folders]);

	const handleLike = (id: string) => {
		setImages((prevImages) => {
			const newImages = prevImages.map((img) =>
				img.id === id ? { ...img, likes: img.likes + 1 } : img
			);

			if (openFolderData.folder !== null) {
				// ensure we only use images from the modal
				const updatedImagesInModal = openFolderData.folder.images.map((img) =>
					img.id === id ? { ...img, likes: img.likes + 1 } : img
				);

				const updatedFolder = {
					...openFolderData.folder,
					images: updatedImagesInModal,
				};

				setOpenFolderData((prevState) => ({ ...prevState, folder: updatedFolder }));
			}

			return newImages;
		});
	};

	const moveImage = (dragIndex: number, hoverIndex: number) => {
		setImages((prevImages) => {
			const updatedImages = [...prevImages];
			const [movedImage] = updatedImages.splice(dragIndex, 1);
			updatedImages.splice(hoverIndex, 0, movedImage);
			return updatedImages;
		});
	};

	const moveFolder = (dragIndex: number, hoverIndex: number) => {
		setFolders((prevFolders) => {
			const updatedFolders = [...prevFolders];
			const [movedFolder] = updatedFolders.splice(dragIndex, 1);
			updatedFolders.splice(hoverIndex, 0, movedFolder);
			return updatedFolders;
		});
	};

	const handleFolderCreate = (folderName: string) => {
		const newFolder = {
			id: `folder-${folders.length + 1}`,
			name: folderName,
			images: [],
		};
		setFolders([...folders, newFolder]);
	};

	const handleEditFolder = (folderId: string) => {
		const folderToEdit = folders.find((folder) => folder.id === folderId);
		if (folderToEdit) {
			setEditFolderData({ id: folderToEdit.id, name: folderToEdit.name });
		}
	};

	const handleRenameFolder = (newName: string) => {
		setFolders((prevFolders) =>
			prevFolders.map((folder) =>
				folder.id === editFolderData?.id ? { ...folder, name: newName } : folder
			)
		);
		setEditFolderData(null);
	};

	const handleDeleteFolder = () => {
		setFolders((prevFolders) =>
			prevFolders.filter((folder) => folder.id !== editFolderData?.id)
		);
		setEditFolderData(null);
	};

	const handleEditClose = () => {
		setEditFolderData(null);
	};

	const handleDropImageInFolder = (imageId: string, folderIndex: number) => {
		const droppedImage = images.find((image) => image.id === imageId);

		if (droppedImage) {
			const newImages = images.filter((image) => image.id !== imageId);

			setFolders((prevFolders) =>
				prevFolders.map((folder, index) => {
					if (index === folderIndex) {
						return {
							...folder,
							images: folder.images.find((img) => img.id === imageId)
								? folder.images
								: [...folder.images, { ...droppedImage }],
						};
					} else {
						return folder;
					}
				})
			);

			setImages(newImages);
		}
	};

	const handleFolderClick = (folderId: string) => {
		const clickedFolder = folders.find((folder) => folder.id === folderId);
		if (clickedFolder) {
			setOpenFolderData({ folder: clickedFolder, showModal: true });
		}
	};

	const handleCloseFolderModal = () => {
		setOpenFolderData({ folder: null, showModal: false });
	};

	const handleModalClose = () => {
		setOpenFolderData((prevState) => ({ ...prevState, showModal: false }));
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<div style={{ display: 'flex', minHeight: '100vh' }}>
				{/* Left panel */}
				<div className='panelSm'>
					<img
						src='/assets/images/logo.png'
						alt='Folder Icon'
						style={{ width: '220px', marginBottom: '20px' }}
					/>

					<ul className='flex flex-col gap-2 '>
						<li>
							<a
								className='flex h-12 items-center gap-2 rounded-[11px] border border-transparent px-3 py-2 text-sm transition-opacity font-medium hover:border-gray-200'
								href='/'
							>
								Explore destinations
							</a>
						</li>
						<li>
							<a
								className='flex h-12 items-center gap-2 rounded-[11px] border border-transparent px-3 py-2 text-sm transition-opacity font-medium hover:border-gray-200'
								href='/'
							>
								Itineraries
							</a>
						</li>
					</ul>

					<div className='left-panel-items'>
						<MdCardTravel
							size={22}
							style={{ marginRight: '10px', color: '#514b4b' }}
						/>
						My trips
					</div>

					<div className='left-panel-items  left-panel-items-shared'>
						<FaRegShareFromSquare
							size={22}
							style={{ marginRight: '10px', color: '#4c4949' }}
						/>
						<Link href='/dashboard'>Shared folders</Link>
					</div>
				</div>

				<div style={{ flex: 1 }}>
					{/* Header Section */}
					<div
						style={{ position: 'relative', textAlign: 'center', marginTop: '20px' }}
					>
						<h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>My Trips</h1>
						<p style={{ color: '#9e9b9b' }}>
							Organize your group adventures with ease
						</p>
					</div>

					{/* Button Section */}

					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							marginTop: '20px',
							marginBottom: '20px',
							width: '100%',
						}}
					>
						<button className='header-button'>
							<span className='header-button-text'>Destinations</span>
							<span style={{ flexGrow: 1, marginRight: '2px' }}>Itineraries</span>
						</button>
					</div>

					<div>
						<div style={{ display: 'flex' }}>
							<div className='add-folder-button'>
								<button onClick={() => setCreateFolderModalOpen(true)}>
									+ Add Folder
								</button>
							</div>
							<div className='shared-folder-button'>
								<Link href='/dashboard'>
									<FaRegShareFromSquare size={22} />
								</Link>
							</div>
						</div>

						<CreateFolderModal
							isOpen={createFolderModalOpen}
							onClose={() => setCreateFolderModalOpen(false)}
							onCreate={handleFolderCreate}
						/>
						<div
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								gap: '40px',
								marginBottom: '30px',
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
										moveFolder={moveFolder}
										canDrag={true}
										showEditIcon={true}
										onDropImage={(imageId) =>
											handleDropImageInFolder(imageId, index)
										}
										onClick={() => handleFolderClick(folder.id)}
										onEdit={() => handleEditFolder(folder.id)}
									/>
								))}
						</div>

						{/* Edit Modal */}
						{editFolderData && (
							<EditFolderModal
								isOpen={true}
								onClose={handleEditClose}
								folderName={editFolderData.name}
								onRename={handleRenameFolder}
								onDelete={handleDeleteFolder}
							/>
						)}

						{selectedFolder && (
							<>
								<h1 style={{ marginLeft: '100px', fontSize: '18px' }}>
									Images in{' '}
									{folders.find((folder) => folder.id === selectedFolder)?.name}
								</h1>
								<div
									style={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: '5px',
										marginTop: '16px',
										marginLeft: '0px',
									}}
								>
									{folders
										.find((folder) => folder.id === selectedFolder)
										?.images.map((image, index) => {
											const originalImageIndex = images.findIndex(
												(img) => img.id === image.id
											);
											return (
												<ImageDisplay
													key={image.id}
													id={image.id}
													src={image.src}
													name={image.name}
													likes={image.likes}
													onLike={handleLike}
													index={originalImageIndex}
													moveImage={moveImage}
													canDrag={true}
												/>
											);
										})}
								</div>
							</>
						)}

						<h1 className='smallHeader'>My Saved Destinations</h1>
						<div className='image-container'>
							{isClient &&
								images.map((image, index) => (
									<ImageDisplay
										key={image.id}
										id={image.id}
										src={image.src}
										name={image.name}
										index={index}
										likes={image.likes}
										onLike={handleLike}
										moveImage={moveImage}
										canDrag={true}
									/>
								))}
						</div>
					</div>
				</div>
				{/* Open folder modal */}
				{openFolderData.folder && (
					<OpenFolderModal
						isOpen={openFolderData.showModal}
						onClose={handleCloseFolderModal}
						folder={openFolderData.folder}
						handleLike={handleLike}
					/>
				)}
			</div>
		</DndProvider>
	);
};
export default Page;
