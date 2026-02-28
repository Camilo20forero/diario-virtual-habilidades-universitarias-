// main.js
import { diaryEntries, getUniqueTags } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('entries-grid');
    const tagsContainer = document.getElementById('tags-container');

    // Variables de Modal
    const modal = document.getElementById('model-modal');
    const closeBtn = document.getElementById('close-modal');
    const modalViewerContainer = document.getElementById('modal-model-container');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');

    let currentFilter = 'all';

    // --- Funciones de Renderizado ---

    function renderTags() {
        const tags = getUniqueTags();

        // El botón 'all' ya existe en HTML, pero podemos borrar y regenerar todo
        tagsContainer.innerHTML = '';

        const allBtn = document.createElement('button');
        allBtn.classList.add('tag-btn', 'active');
        allBtn.dataset.tag = 'all';
        allBtn.textContent = 'Todas';
        allBtn.addEventListener('click', () => filterEntries('all'));
        tagsContainer.appendChild(allBtn);

        tags.forEach(tag => {
            const btn = document.createElement('button');
            btn.classList.add('tag-btn');
            btn.dataset.tag = tag;
            btn.textContent = '#' + tag;
            btn.addEventListener('click', () => filterEntries(tag));
            tagsContainer.appendChild(btn);
        });
    }

    function filterEntries(tag) {
        currentFilter = tag;

        // Actualizar UI de botones
        const buttons = tagsContainer.querySelectorAll('.tag-btn');
        buttons.forEach(btn => {
            if (btn.dataset.tag === tag) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Re-renderizar
        renderEntries();
    }

    function renderEntries() {
        container.innerHTML = ''; // Limpiar

        const filtered = (currentFilter === 'all')
            ? diaryEntries
            : diaryEntries.filter(entry => entry.tags && entry.tags.includes(currentFilter));

        filtered.forEach(entry => {
            const card = document.createElement('article');
            card.classList.add('entry-card');

            // Header
            const header = document.createElement('header');
            header.classList.add('entry-header');

            const date = document.createElement('span');
            date.classList.add('entry-date');
            date.textContent = entry.date;

            const title = document.createElement('h2');
            title.classList.add('entry-title');
            title.textContent = entry.title;

            const tagsWrap = document.createElement('div');
            tagsWrap.classList.add('entry-tags');

            if (entry.tags) {
                entry.tags.forEach(tag => {
                    const badge = document.createElement('span');
                    badge.classList.add('tag-badge');
                    badge.textContent = tag;
                    tagsWrap.appendChild(badge);
                });
            }

            header.appendChild(date);
            header.appendChild(title);
            header.appendChild(tagsWrap);
            card.appendChild(header);

            // Contenido interactivo (Modelo 3D o Imagen)
            if (entry.modelUrl) {
                const modelWrap = document.createElement('div');
                modelWrap.classList.add('model-wrapper');

                // Listener para abrir el modal al clickear la cajita
                modelWrap.addEventListener('click', () => openModal(entry));

                const viewer = document.createElement('model-viewer');
                viewer.classList.add('card-viewer');
                viewer.src = entry.modelUrl;
                viewer.alt = `Modelo 3D para ${entry.title}`;
                viewer.autoRotate = true;
                viewer.cameraControls = false; // Deshabilitado aquí para no estorbar el scroll, se habilitará en el modal
                viewer.environmentImage = 'neutral';
                viewer.shadowIntensity = "1";

                modelWrap.appendChild(viewer);
                card.appendChild(modelWrap);
            } else if (entry.image) {
                const img = document.createElement('img');
                img.classList.add('entry-image');
                img.src = entry.image;
                img.alt = `Boceto para ${entry.title}`;
                card.appendChild(img);
            }

            // Reflexión
            const reflection = document.createElement('div');
            reflection.classList.add('entry-reflection');

            const refTitle = document.createElement('h3');
            refTitle.textContent = 'Reflexión';

            const refText = document.createElement('p');
            refText.textContent = entry.reflection;

            reflection.appendChild(refTitle);
            reflection.appendChild(refText);
            card.appendChild(reflection);

            container.appendChild(card);
        });
    }

    // --- Lógica del Modal 3D ---

    let modalViewerInstance = null;

    function openModal(entry) {
        if (!entry.modelUrl) return;

        // Setear textos
        modalTitle.textContent = entry.title;
        modalDesc.textContent = entry.reflection;

        // Limpiar contenedor del modal
        modalViewerContainer.innerHTML = '';

        // Crear el visor 3D en pantalla grande
        modalViewerInstance = document.createElement('model-viewer');
        modalViewerInstance.classList.add('full-viewer');
        modalViewerInstance.src = entry.modelUrl;
        modalViewerInstance.alt = `Vista en detalle de ${entry.title}`;
        modalViewerInstance.autoRotate = true;
        modalViewerInstance.cameraControls = true; // Aquí sí habilitamos los controles completos
        modalViewerInstance.environmentImage = 'neutral';
        modalViewerInstance.shadowIntensity = "1";

        modalViewerContainer.appendChild(modalViewerInstance);

        // Mostrar modal
        modal.classList.remove('hidden');
        // Prevenir el scroll en el body
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';

        // Detener animación/rendereo del modal para ahorrar recursos
        if (modalViewerInstance) {
            modalViewerContainer.innerHTML = '';
            modalViewerInstance = null;
        }
    }

    // Listeners del modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(); // Cerrar si hace click fuera del contenido (en el fondo oscuro)
        }
    });

    // Escuchar tecla escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // --- Inicialización ---
    renderTags();
    renderEntries();
});
