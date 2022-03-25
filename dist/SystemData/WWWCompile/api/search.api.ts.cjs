require("source-map-support").install();
var __dirname = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/api", __filename = "/Users/idoio/Documents/beyond-easy/tests/core/Website/WWW/api/search.api.ts";
module.exports = async (require2) => {
  var module2 = { exports: {} }, exports2 = module2.exports;
  const { SearchRecord } = await require2("@eas-framework/server");
  const docSearch = new SearchRecord("records/search.serv");
  await docSearch.load();
  exports2.default = {
    GET: {
      define: {
        query: String
      },
      func(Request, Response, _, { query }) {
        return docSearch.search(query).map((x) => ({ text: x.text, link: x.link }));
      }
    }
  };
  return module2.exports;
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL1dXVy9hcGkvc2VhcmNoLmFwaS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsicmVxdWlyZSgnc291cmNlLW1hcC1zdXBwb3J0JykuaW5zdGFsbCgpO3ZhciBfX2Rpcm5hbWU9XCIvVXNlcnMvaWRvaW8vRG9jdW1lbnRzL2JleW9uZC1lYXN5L3Rlc3RzL2NvcmUvV2Vic2l0ZS9XV1cvYXBpXCIsX19maWxlbmFtZT1cIi9Vc2Vycy9pZG9pby9Eb2N1bWVudHMvYmV5b25kLWVhc3kvdGVzdHMvY29yZS9XZWJzaXRlL1dXVy9hcGkvc2VhcmNoLmFwaS50c1wiO21vZHVsZS5leHBvcnRzID0gKGFzeW5jIChyZXF1aXJlKT0+e3ZhciBtb2R1bGU9e2V4cG9ydHM6e319LGV4cG9ydHM9bW9kdWxlLmV4cG9ydHM7Y29uc3Qge1NlYXJjaFJlY29yZH0gPSBhd2FpdCByZXF1aXJlKCdAZWFzLWZyYW1ld29yay9zZXJ2ZXInKVxuXG5jb25zdCBkb2NTZWFyY2ggPSBuZXcgU2VhcmNoUmVjb3JkKCdyZWNvcmRzL3NlYXJjaC5zZXJ2JylcbmF3YWl0IGRvY1NlYXJjaC5sb2FkKClcblxuZXhwb3J0cy5kZWZhdWx0PXtcbiAgICBHRVQ6IHtcbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgICBxdWVyeTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmMgKFJlcXVlc3QsIFJlc3BvbnNlLCBfLCB7cXVlcnl9KXtcbiAgICAgICAgICAgcmV0dXJuIGRvY1NlYXJjaC5zZWFyY2gocXVlcnkpLm1hcCh4ID0+ICh7dGV4dDogeC50ZXh0LCBsaW5rOiB4Lmxpbmt9KSlcbiAgICAgICAgfVxuICAgIH1cbn1cbnJldHVybiBtb2R1bGUuZXhwb3J0czt9KTsiXSwKICAibWFwcGluZ3MiOiAiQUFBQSxRQUFRLG9CQUFvQixFQUFFLFFBQVE7QUFBRSxJQUFJLFlBQVUsaUVBQWdFLGFBQVc7QUFBOEUsT0FBTyxVQUFXLE9BQU8sYUFBVTtBQUFDLE1BQUksVUFBTyxFQUFDLFNBQVEsQ0FBQyxFQUFDLEdBQUUsV0FBUSxRQUFPO0FBQVEsUUFBTSxFQUFDLGlCQUFnQixNQUFNLFNBQVEsdUJBQXVCO0FBRTlWLFFBQU0sWUFBWSxJQUFJLGFBQWEscUJBQXFCO0FBQ3hELFFBQU0sVUFBVSxLQUFLO0FBRXJCLFdBQVEsVUFBUTtBQUFBLElBQ1osS0FBSztBQUFBLE1BQ0QsUUFBUTtBQUFBLFFBQ0osT0FBTztBQUFBLE1BQ1g7QUFBQSxNQUNBLEtBQU0sU0FBUyxVQUFVLEdBQUcsRUFBQyxTQUFPO0FBQ2pDLGVBQU8sVUFBVSxPQUFPLEtBQUssRUFBRSxJQUFJLE9BQU0sR0FBQyxNQUFNLEVBQUUsTUFBTSxNQUFNLEVBQUUsS0FBSSxFQUFFO0FBQUEsTUFDekU7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNBLFNBQU8sUUFBTztBQUFROyIsCiAgIm5hbWVzIjogW10KfQo=
