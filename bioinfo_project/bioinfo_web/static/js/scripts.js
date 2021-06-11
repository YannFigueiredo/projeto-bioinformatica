function verificar_campos_vazios() {
    var text_area = document.getElementById('textArea');
    var file = document.getElementById('customFile');
    var requered = file.getAttribute("required");
    if (!text_area.value) {
        file.setAttribute("required", "true");
        console.log("area vazia")
    }
    if (text_area.value) {
        file.removeAttribute("required")
        console.log("area com texto")

    }

}
