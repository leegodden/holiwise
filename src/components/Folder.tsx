import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GrEdit } from 'react-icons/gr';

export interface FolderProps {
	id: string;
	name: string;
	index: number;
	moveFolder: (dragIndex: number, hoverIndex: number) => void;
	canDrag: boolean;
	onDropImage: (imageId: string) => void;
	onClick: () => void;
	onEdit: () => void;
	showEditIcon: boolean;
}

interface DragItem {
	id: string;
	index: number;
	type: string;
}

const Folder: React.FC<FolderProps> = ({
	id,
	name,
	index,
	moveFolder,
	canDrag,
	onDropImage,
	onClick,
	onEdit,
	showEditIcon,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [isHovered, setIsHovered] = useState(false);

	const [, drop] = useDrop({
		accept: 'DraggableImage',
		drop: (item: DragItem) => {
			onDropImage(item.id);
		},
	});

	const [{ isDragging }, drag] = useDrag({
		type: 'Folder',
		item: { id, index },
		canDrag,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const handleFolderClick = () => {
		onClick();
	};

	drag(drop(ref));

	return (
		<div
			className={`folder-container ${isDragging ? 'isDragging' : ''}`}
			ref={ref}
			onClick={handleFolderClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{
				borderRadius: '8px',
				padding: '8px',
				marginBottom: '8px',
				cursor: 'pointer',
				display: 'inline-flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
				opacity: isDragging ? 0.5 : 1,
				backgroundColor: 'white',
				position: 'relative',
			}}
		>
			<div style={{ marginBottom: '4px' }}>
				<img
					src='/assets/images/blue-folder.png'
					alt='Folder Icon'
					style={{ width: '165px', height: '119px' }}
				/>
			</div>
			<div style={{ fontSize: '12px' }}>{name}</div>
			{showEditIcon && isHovered && (
				<div
					className='edit-folder-icon'
					onClick={(e) => {
						e.stopPropagation(); // Prevent triggering onClick of the folder
						onEdit();
					}}
				>
					{' '}
					<GrEdit />
				</div>
			)}
		</div>
	);
};

export default Folder;
