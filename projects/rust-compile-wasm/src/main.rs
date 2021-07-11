mod actions;
mod builder;
use builder::InsertComponent;

fn main() {
    //println!("{:?}", actions::base_reader::find_end_of_def("=newAlertsLength == 0 ? 'd-none': 'd-inline-block'", vec![";", "\n", "%>"]));
    let mut parser = InsertComponent::new(vec![vec!["%".to_owned(), "%".to_owned()], vec!["#{debug}".to_owned(), "{debug}#".to_owned()]], vec!["textarea".to_owned(),"script".to_owned(), "style".to_owned()]);

    let text = r#"
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Signup</title>
        <link rel="stylesheet" href="/files/bootstrap.rtl.min.css"/>
        <style>
            body {
                font-size: 16px;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">web</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="\#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <ul class="navbar-nav me-auto mb-2 mb-md-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/">home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/login.html">login</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/signup.html">signup</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/search.html">search</a>
                        </li>
                    </ul>
                    <form class="d-flex" action="/search.html" method="GET">
                        <input type="hidden" name="search_on" value="anime"/>
                        <input class="form-control me-2" type="search" placeholder="search" name="query" aria-label="Search"/>
                        <button class="btn btn-outline-success" type="submit"> search </button>
                    </form>
                </div>
            </div>
        </nav>
        <div id='main' style='margin: 10px;margin-top:40px;'>   
        <titles:subtitle mt="1" class="d-inline-block" &v-text="a.title"></titles:subtitle>
    </body>
</html>"#;

    let index = parser.public_html_element(text, "html");

    
    println!("index {:?}, array:  {:?}", index, parser.error_vec);

    parser.clear();

    let index = parser.find_close_char(text, "</html", "<", ">", &'/', false, 0);


    println!("index {:?}, array:  {:?}", index, parser.error_vec);

    println!("{:?}", actions::base_actions::cut_start(text, index as usize));

    
    let text2: String = text.chars().skip(parser.error_vec[0].index as usize).collect();

    println!("text {:?}", text2);


// println!("text {:?}", actions::base_reader::find_end_of_def_char("123>3", '>'));

}
