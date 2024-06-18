import React, { useRef, useState } from 'react';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import { FcLike } from 'react-icons/fc';

const imageType = 'DraggableImage';

interface IDragItem {
	type: string;
	index: number;
	id: string;
}

export interface IImageProps {
	id: string;
	name: string;
	src: string;
	index: number;
	likes?: number;
	onLike?: (id: string) => void;
	moveImage: (dragIndex: number, hoverIndex: number) => void;
	canDrag: boolean;
	link?: string; // Added link prop
}

const ImageDisplay: React.FC<IImageProps> = ({
	id,
	src,
	name,
	index,
	moveImage,
	canDrag,
	likes,
	onLike,
	link,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const isLikeActiveRef = useRef(false);
	const [isLikeActive, setIsLikeActive] = useState(false);

	const handleMouseDown = (e: React.MouseEvent) => {
		const target = e.currentTarget as HTMLElement;
		isLikeActiveRef.current = e.clientX - target.offsetLeft <= 20;
	};

	const [{ isDragging }, drag] = useDrag({
		type: imageType,
		item: { id, index, type: imageType },
		canDrag: (monitor) => canDrag && !isLikeActiveRef.current,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const [, drop] = useDrop({
		accept: imageType,
		hover: (item: IDragItem, monitor) => {
			if (!ref.current) return;
			const dragIndex = item.index;
			const hoverIndex = index;
			if (dragIndex === hoverIndex) return;

			const hoverBoundingRect = ref.current.getBoundingClientRect();
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
			const clientOffset = monitor.getClientOffset();
			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

			item.index = hoverIndex;
			moveImage(dragIndex, hoverIndex);
		},
		drop: (item: IDragItem) => {},
	});

	drag(drop(ref));

	const handleClick = () => {
		if (link && !isDragging) {
			window.open(link, '_blank');
		}
	};

	return (
		<div
			ref={ref}
			onMouseDown={handleMouseDown}
			onClick={handleClick}
			style={{
				opacity: isDragging ? 0.5 : 1,
				padding: '8px',
				margin: '4px',
				cursor: canDrag ? 'move' : 'pointer', // Changed cursor to pointer
				width: '360px',
				height: '250px',
				position: 'relative',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: '10px',
					right: '10px',
					display: 'flex',
					alignItems: 'center',
				}}
			>
				{onLike && (
					<FcLike
						size={20}
						onClick={(e) => {
							e.preventDefault(); // prevent default event action
							console.log('Like icon clicked for image id:', id);
							onLike(id);
						}}
					/>
				)}
				{likes != null && (
					<span
						style={{
							marginLeft: '2px',
							fontSize: '13px',
						}}
					>
						{likes}
					</span>
				)}
			</div>

			{link ? (
				<a
					href={link}
					target='_blank'
					rel='noopener noreferrer'
					style={{ textDecoration: 'none' }}
				>
					<img
						src={src}
						alt='Draggable Image'
						style={{
							width: '100%',
							height: 'auto',
							borderRadius: '10px',
							cursor: 'pointer', // Ensures cursor is pointer on image click
						}}
					/>
					<div style={{ marginTop: '8px', fontSize: '15px' }}>{name}</div>
				</a>
			) : (
				<>
					<img
						src={src}
						alt='Draggable Image'
						style={{
							width: '100%',
							height: 'auto',
							borderRadius: '10px',
							cursor: 'pointer', // Ensures cursor is pointer on image click
						}}
					/>
					<div style={{ marginTop: '8px', fontSize: '15px' }}>{name}</div>
				</>
			)}
		</div>
	);
};

export default ImageDisplay;
