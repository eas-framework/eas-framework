const search = document.querySelector("#search");
const openLink = document.querySelector("#openLink");
function updateLink() {
  const link = "/server/api/search/" + search.value;
  openLink.href = link;
  openLink.innerText = link;
}
search.addEventListener("input", updateLink);
updateLink();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9XV1cvc2VydmVyL2FwaS9pbmRleC5wYWdlLnNvdXJjZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFVSSxNQUFNLFNBQVMsU0FBUyxjQUFjLFNBQVM7QUFDL0MsTUFBTSxXQUFXLFNBQVMsY0FBYyxXQUFXO0FBQ25ELHNCQUFxQjtBQUNqQixRQUFNLE9BQU8sd0JBQXdCLE9BQU87QUFDNUMsV0FBUyxPQUFPO0FBQ2hCLFdBQVMsWUFBWTtBQUN6QjtBQUNBLE9BQU8saUJBQWlCLFNBQVMsVUFBVTtBQUMzQyxXQUFXIiwiZmlsZSI6ImluZGV4LnBhZ2UifQ==