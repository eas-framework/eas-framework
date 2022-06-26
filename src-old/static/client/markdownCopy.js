function markdownCopy(el) {
    navigator.clipboard.writeText(el.parentElement.nextElementSibling.innerText.trim());
}