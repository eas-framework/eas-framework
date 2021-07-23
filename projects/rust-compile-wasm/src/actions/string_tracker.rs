use serde::{Deserialize, Serialize};

#[derive(Debug, Clone)]
#[derive(Serialize, Deserialize)]
pub struct CharTracker {
    pub text: char,
    pub info: String,
    pub line: usize,
    pub char: usize
}

impl CharTracker {
    fn Clone(self) -> CharTracker{
        CharTracker {
            text: self.text.clone(),
            info: self.info.clone(),
            line: self.line.clone(),
            char: self.char.clone()
        }
    }
}

pub struct StringTracker {
    pub data_vector: Vec<CharTracker>
}

impl StringTracker {

    pub fn new(info: String, text: String) -> Self {
        let mut this = StringTracker {
            data_vector: vec![]
        };

        this.add_text(info, text);

        this
    }

    fn add_text(&mut self, info: String, text: String){
        let chars: Vec<char> = text.chars().collect();

        let mut line = 0;
        let mut char_count = 1;
        for i in chars.iter() {

            self.data_vector.push(CharTracker {
                text: i.to_owned(),
                info: info.to_owned(),
                line,
                char: char_count
            });

            if i == &'\n' {
                line+=1;
                char_count = 1;
            }
        }
    }

    fn at_char(self, index: usize) -> char {
        self.data_vector[index].text
    }

    fn cut(self, index_start: usize, index_end: usize) -> StringTracker{
        let chars: Vec<CharTracker>= self.data_vector.into_iter().skip(index_start).take(index_end-index_start).collect();

        StringTracker {
            data_vector: chars
        }
    }

    fn cut_start(self, index: usize) -> StringTracker{
        let chars: Vec<CharTracker>= self.data_vector.into_iter().skip(index).collect();

        StringTracker {
            data_vector: chars
        }
    }

    fn cut_end(self, index: usize) -> StringTracker{
        let chars: Vec<CharTracker>= self.data_vector.into_iter().take(index).collect();

        StringTracker {
            data_vector: chars
        }
    }
}