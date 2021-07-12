mod actions;
mod builder;
use builder::InsertComponent;

fn main() {
    //println!("{:?}", actions::base_reader::find_end_of_def("=newAlertsLength == 0 ? 'd-none': 'd-inline-block'", vec![";", "\n", "%>"]));
    let mut parser = InsertComponent::new(vec![vec!["%".to_owned(), "%".to_owned()], vec!["#{debug}".to_owned(), "{debug}#".to_owned()]], vec!["textarea".to_owned(),"script".to_owned(), "style".to_owned()]);

    let text = r#"html>
    <input type="checkbox" id="checkbox" <%=(isDebug ? 'checked': '')%>/><label for="checkbox">checkbox</label>
    </html>"#;

    let index = parser.find_close_char(text, ">");

    
    println!("index {:?}, array:  {:?}", index, parser.error_vec);

    // parser.clear();

    // let index = parser.find_close_char(text, "</html", "<", ">", &'/', false, 0);


    // println!("index {:?}, array:  {:?}", index, parser.error_vec);

    // println!("{:?}", actions::base_actions::cut_start(text, index as usize));

    
    let text2: String = text.chars().skip(parser.error_vec[0].index as usize).collect();

    println!("text {:?}", text2);


// println!("text {:?}", actions::base_reader::find_end_of_def_char("123>3", '>'));

}
