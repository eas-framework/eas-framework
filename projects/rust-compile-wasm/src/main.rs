mod actions;
mod builder;
use builder::InsertComponent;
mod razor;

fn main() {
    //println!("{:?}", actions::base_reader::find_end_of_def("=newAlertsLength == 0 ? 'd-none': 'd-inline-block'", vec![";", "\n", "%>"]));
    let mut parser = InsertComponent::new(vec![vec!["%".to_owned(), "%".to_owned()], vec!["#{debug}".to_owned(), "{debug}#".to_owned()]], vec!["textarea".to_owned(),"script".to_owned(), "style".to_owned()]);

    let text = r#"
    <head>
        <meta charset=\"UTF-8\"/>
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>
        <title>Home Page</title>
        <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC\" crossorigin=\"anonymous\"/>
        <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM\" crossorigin=\"anonymous\"></script>
        <g
    </head>

    </html>"#;

    // let index = parser.find_close_char(text, ">");

    
    // println!("index {:?}, array:  {:?}", index, parser.error_vec);

//     let text = r#"isDebug ? "checked": '')/><label for="checkbox">checkbox</label>
//     </div>
// </main>
// </body>
// </html>
// "#;
//     let char_types = vec!['(', ')'];
//     let index_block = actions::base_reader::block_skip_text(text, char_types);

//     let text_it: String = text.chars().skip(index_block as usize).collect();

//     println!("index {:?}, next:  {:?}", index_block, text_it);

    // parser.clear();

    let index = parser.public_html_element(text, "html");


    println!("index {:?}, array:  {:?}", index, parser.error_vec);

    println!("{:?}", actions::base_actions::cut_start(text, index as usize));

    
    let text2: String = text.chars().skip(parser.error_vec[0].index as usize).collect();

    println!("text {:?}", text2);


//     println!("text {:?}", actions::base_reader::block_skip_text(r#"    <div>refre</div>
// }"#, vec!['{', '}']));
    

}
