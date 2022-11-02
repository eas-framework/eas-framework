import PPath from "../../../src/Settings/PPath.js";
import {directories} from "../../../src/Settings/ProjectConsts.js";
import StringTracker from "../../../src/SourceTracker/StringTracker/StringTracker.js";

export function getWebsiteModel() {
    return StringTracker.fromTextFile(`
#[codeFile='inherit']
<!DOCTYPE html>
<html lang="en" me=more>
#('---Compile Runtime---')
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EAS Tests |
        <:title />
    </title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vinorodrigues/bootstrap-dark@0.6.1/dist/bootstrap-dark.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <:head />
</head>
<body>
    <content:insert>
    moo
    </content:insert>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">EAS - Tests</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <NavLink name="Home" link="/" />
                    <NavLink name="Tests" link="/tests" />
                    <NavLink name="Generated Static" link="/static" />
                    <NavLink name="Generated Compile" link="/compile" />
                </ul>
                <form class="d-flex">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </div>
    </nav>
    <!-- Begin page content -->
    <main class="flex-shrink-0 pt-5">
        <div class="container mt-5">
            <:body />
        </div>
    </main>
</body>

</html>`, PPath.fromNested(directories.Locate.static, 'models/site.model'));
}
