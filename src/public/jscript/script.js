'use strict';

// JS for Nav

const outNav = document.querySelector('.out-nav');

if (outNav) {
	function getUserOptions () {
		const userId = document.querySelector('.avatar-nav').getAttribute('data-id');
		const cOptions = document.createElement('DIV');
		cOptions.setAttribute('class', 'options-nav');

		cOptions.innerHTML = `
			<div class="header-nav">${userId}</div>
			<div class="body-nav">
				<div class="option-nav">
					<a class="link-option-nav" href="/user/${userId}/post">
						<i class="fa-regular fa-images"></i>
						<p>Post</p>
					</a>
				</div>
				<div class="option-nav">
					<a class="link-option-nav" href="/user/${userId}/comments">
						<i class="fa-regular fa-comments"></i>
						<p>Comments</p>
					</a>
				</div>
				<div class="option-nav">
					<a class="link-option-nav" href="/user/${userId}/about">
						<i class="fa-regular fa-file-lines"></i>
						<p>About</p>
					</a>
				</div>
				<div class="option-nav">
					<a class="link-option-nav" href="/user/${userId}/upload">
						<i class="fa-solid fa-file-arrow-up"></i>
						<p>Upload</p>
					</a>
				</div>
				<div class="option-nav">
					<a class="link-option-nav" href="/user/${userId}/settings">
						<i class="fa-solid fa-gear"></i>
						<p>Settings</p>
					</a>
				</div>
				<div class="option-nav">
					<a class="link-option-nav" href="/logout">
						<i class="fa-solid fa-arrow-right-from-bracket"></i>
						<p>Log Out</p>
					</a>
				</div>
			</div>
		`;

		outNav.appendChild(cOptions);
		outNav.removeEventListener('click', getUserOptions);
		cOptions.addEventListener('mouseleave', () => {
			outNav.removeChild(cOptions);
			outNav.addEventListener('click', getUserOptions);
		});
	};
	outNav.addEventListener('click', getUserOptions);
};

// JS for Gallery

const sGallery = document.querySelector('.select-gallery');
const gallery = document.querySelector('.index-gallery');

if (sGallery) {
	function callList () {
		const getAllFragments = images => {
			const fragment = new DocumentFragment();
			for (const image of images) {
				const box = document.createElement('DIV');
				box.setAttribute('class', 'box-gallery');
				box.innerHTML = `
					<a href="/gallery/${image.uniqueId}" class="link-gallery">
						<div class="text-gallery">
							<h2>
								${image.title}
							</h2>
							<div>
								${image._id}
								${image.totalLikes}
								${image.totalDislikes}
								${image.views}
							</div>
						</div>
					</a>
					<img src="/uploads/${image.filename}" class="image-gallery">
				`;
				fragment.append(box);
			}
			return fragment;
		};

		const addImages = async e => {
			sGallery.removeChild(list);
			document.querySelector('.text-select-gallery').textContent = e.target.textContent;
			gallery.innerHTML = '';
			const res = await fetch(`/gallery/alter/${e.target.textContent.toLowerCase()}`);
			const res2 = await res.json();
			if (res2 instanceof Array) gallery.append(getAllFragments(res2));
			else gallery.innerHTML = res2;
			sGallery.addEventListener('click', callList);
		};

		sGallery.removeEventListener('click', callList);

		const list = document.createElement('DIV');
		const newOption = document.createElement('DIV');
		const oldOption = document.createElement('DIV');
		const bestOption = document.createElement('DIV');

		list.setAttribute('class', 'list-gallery');
		newOption.setAttribute('class', 'options-gallery');
		oldOption.setAttribute('class', 'options-gallery');
		bestOption.setAttribute('class', 'options-gallery');

		newOption.textContent = 'NEWEST';
		oldOption.textContent = 'OLDEST';
		bestOption.textContent = 'BEST';

		newOption.addEventListener('click', addImages);
		oldOption.addEventListener('click', addImages);
		bestOption.addEventListener('click', addImages);

		list.appendChild(newOption);
		list.appendChild(oldOption);
		list.appendChild(bestOption);
		sGallery.appendChild(list);

		list.addEventListener('mouseleave', () => {
			sGallery.removeChild(list);
			sGallery.addEventListener('click', callList);
		});
	};

	sGallery.addEventListener('click', callList);
};

const fAvatar = document.getElementById('file-avatar');
const fImg = document.getElementById('file-img');

if (fAvatar) {
	const readFile = file => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener('load', e => fImg.setAttribute('src', e.target.result));
	};

	fAvatar.addEventListener('change', () => {
		readFile(fAvatar.files[0]);
	});
}

// JS for Input

const iComment = document.getElementById('input-comment');
const fComment = document.getElementById('form-comment');

if (iComment) {
	function createBox () {
		const btnBox = document.createElement('DIV');
		const btnCancel = document.createElement('BUTTON');
		const btnSend = document.createElement('BUTTON');

		btnCancel.setAttribute('class', 'cancel-comment');
		btnCancel.textContent = 'CANCEL';

		btnSend.setAttribute('class', 'send-comment');
		btnSend.textContent = 'SEND';

		btnBox.setAttribute('class', 'box-comment');
		btnBox.appendChild(btnCancel);
		btnBox.appendChild(btnSend);

		fComment.appendChild(btnBox);

		btnCancel.addEventListener('click', () => {
			fComment.removeChild(btnBox);
			iComment.addEventListener('click', createBox);
		});

		iComment.removeEventListener('click', createBox);
	};

	iComment.addEventListener('click', createBox);
};

// JS for Delete Image

const bDelete = document.querySelector('.delete-image');

if (bDelete) {
	bDelete.addEventListener('click', async e => {
		e.preventDefault();
		const res = confirm('Are you sure delete this image?');
		if (res) {
			const imgId = bDelete.getAttribute('data-id');
			const res = await fetch(`/gallery/${imgId}`, {
				method: 'DELETE',
				headers: { 'Content-type': 'application/json' },
				redirect: 'follow'
			});
			const res2 = await res.json();
			window.location.href = res2;
		};
	});
};

// JS for Likes

const like = document.getElementById('like');
const cLikes = document.getElementById('c-likes');
const dislike = document.getElementById('dislike');
const cDislikes = document.getElementById('c-dislike');

if (like) {
	like.addEventListener('click', async () => {
		const imgId = like.getAttribute('data-id');
		const res = await fetch(`/gallery/${imgId}/like`, {
			method: 'POST',
			headers: { 'Content-type': 'application/json' }
		});
		const res2 = await res.json();
		cLikes.textContent = `${res2.like.length}`;
		cDislikes.textContent = `${res2.dislike.length}`;
	});
};

if (dislike) {
	dislike.addEventListener('click', async () => {
		const imgId = dislike.getAttribute('data-id');
		const res = await fetch(`/gallery/${imgId}/dislike`, {
			method: 'POST',
			headers: { 'Content-type': 'application/json' }
		});
		const res2 = await res.json();
		cDislikes.textContent = `${res2.dislike.length}`;
		cLikes.textContent = `${res2.like.length}`;
	});
};

// JS for Form

const fBody = document.querySelector('.body-sign');
const error = document.querySelectorAll('.i-sign');

if (error) {
	for (const e of error) {
		e.addEventListener('click', () => {
			const id = e.getAttribute('data-id');
			const element = document.getElementById(`${id}`);
			fBody.removeChild(element);
		});
	};
};

//  JS for Delete Comments

const iComments = document.querySelectorAll('.container-icon-comment');

if (iComments) {
	for (const comment of iComments) {
		function createBox () {
			const cBox = document.createElement('DIV');
			const cDelete = document.createElement('DIV');

			cBox.setAttribute('class', 'menu-box-comment');
			cDelete.setAttribute('class', 'delete-comment');

			cDelete.textContent = 'Delete';

			cDelete.addEventListener('click', async () => {
				cBox.remove();
				const res = confirm('Are you sure you want to delete this comment?');
				if (res) {
					const cId = comment.getAttribute('data-id');
					const dir = comment.getAttribute('data-dir');
					const res = await fetch(`/gallery/${dir}/comment/${cId}`, {
						method: 'POST',
						headers: { 'Content-type': 'application/json' }
					});
					const res2 = await res.json();
					window.location.href = res2;
				};
			});

			cBox.appendChild(cDelete);

			comment.appendChild(cBox);

			comment.removeEventListener('click', createBox);

			comment.addEventListener('click', () => {
				cBox.remove();
				comment.addEventListener('click', createBox);
			});
		};
		comment.addEventListener('click', createBox);
	}
};

// JS for Delete User
