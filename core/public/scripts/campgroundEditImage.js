const editImageParents = document.querySelectorAll("#campground-form-image-container .edit-image-parent");
const parent = document.getElementById("campground-form-image-container");

editImageParents.forEach((editImageParent) => {
    editImageParent.addEventListener("dragstart", (event) => {
        const img = event.currentTarget.querySelector("img");

        const offsetX = event.offsetX;
        const offsetY = event.offsetY;

        event.dataTransfer.setDragImage(img, offsetX, offsetY);
        event.dataTransfer.setData("text/plain", event.currentTarget.id);
    });

    editImageParent.addEventListener("dragover", (event) => {
        // Allow dropping by preventing the default behavior
        event.preventDefault();
    });

    editImageParent.addEventListener("drop", (event) => {
        event.preventDefault();

        const draggedId = event.dataTransfer.getData("text/plain");
        const draggedElement = document.getElementById(draggedId);
        const targetElement = event.currentTarget;

        // Reorder the elements
        if (draggedElement !== targetElement) {
            const draggedIndex = Array.from(parent.children).indexOf(draggedElement);
            const targetIndex = Array.from(parent.children).indexOf(targetElement);

            if (draggedIndex < targetIndex) {
                parent.insertBefore(draggedElement, targetElement.nextSibling);
            } else {
                parent.insertBefore(draggedElement, targetElement);
            }
        }
    });

    if (!('ontouchstart' in window)) return;

    let draggedElement = null;
    let touchStartX = 0;
    let touchStartY = 0;

    // For touch devices
    editImageParent.addEventListener("touchstart", (event) => {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        draggedElement = event.currentTarget;
        draggedElement.classList.add("dragging");
        event.preventDefault();
    }, { passive: false });

    editImageParent.addEventListener("touchmove", (event) => {
        if (draggedElement) {
            const touch = event.touches[0];
            const diffX = touch.clientX - touchStartX;
            const diffY = touch.clientY - touchStartY;

            draggedElement.style.transform = `translate(${diffX}px, ${diffY}px)`;
        }
    }, { passive: true });

    editImageParent.addEventListener("touchend", (event) => {
        if (!draggedElement) return;
        event.preventDefault();

        const touch = event.changedTouches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
        if (targetElement) {
            const target = targetElement.closest(".edit-image-parent");

            if (target !== draggedElement) {
                const draggedIndex = Array.from(parent.children).indexOf(draggedElement);
                const targetIndex = Array.from(parent.children).indexOf(target);

                if (draggedIndex < targetIndex) {
                    parent.insertBefore(draggedElement, target.nextSibling);
                } else {
                    parent.insertBefore(draggedElement, target);
                }

            }
        }

        draggedElement.style.transform = "translate(0, 0)";
        draggedElement.classList.remove("dragging");
        draggedElement = null;

    }, { passive: false });



});


