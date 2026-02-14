use crate::{barebone::SINGLE_MODE, input::Input};

fn main() {
    let mut input = Input::new();

    if SINGLE_MODE {
        solve(&mut input);
    } else {
        let t: usize = input.next();

        for _ in 0..t {
            solve(&mut input);
        }
    }
}

pub fn solve(input: &mut Input) {
    println!("");
}

pub mod barebone {
    pub static SINGLE_MODE: bool = false;
}

pub mod input {
    use std::{
        collections::VecDeque,
        io::{BufRead, Lines, StdinLock},
        str::FromStr,
    };

    pub trait MyFromStr {
        fn my_from_str(s: &str) -> Self;
    }

    macro_rules! wrap_from_str {
        ($x:ty) => {
            impl MyFromStr for $x {
                fn my_from_str(s: &str) -> Self {
                    <$x>::from_str(s).unwrap()
                }
            }
        };

        ($($x:ty) *) => {
            $(wrap_from_str!($x);)*
        };
    }

    wrap_from_str!(bool char f32 f64 i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize String);

    fn collect<C, T>(s: &str) -> C
    where
        C: FromIterator<T>,
        T: MyFromStr,
    {
        s.split_ascii_whitespace().map(T::my_from_str).collect()
    }

    macro_rules! wrap_collect {
        ($x:ty) => {
            impl<T> MyFromStr for $x
            where
                T: MyFromStr,
            {
                fn my_from_str(s: &str) -> Self {
                    collect(s)
                }
            }
        };

        ($($x:ty) *) => {
            $(wrap_collect!($x);)*
        }
    }

    wrap_collect!(Vec<T> VecDeque<T>);

    macro_rules! impl_tuple {
            (k $($t:ident), *) => {
                impl<$($t), *> MyFromStr for ($($t), *) where $($t: MyFromStr), * {
                    fn my_from_str(s: &str) -> Self {
                        let mut iter = s.split_ascii_whitespace();
                        ($(<$t>::my_from_str(iter.next().unwrap().into())), *)
                    }
                }
            };
            ($t0:ident) => {};
            ($t0:ident, $($t:ident), *) => {
                impl_tuple!(k $t0, $($t), *);
                impl_tuple!($($t), *);
            };
        }

    impl_tuple!(A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P);

    pub struct Input {
        read: Lines<StdinLock<'static>>,
    }

    impl Input {
        #[inline(always)]
        pub fn new() -> Input {
            Input {
                read: std::io::stdin().lock().lines(),
            }
        }

        #[inline(always)]
        pub fn next<T>(&mut self) -> T
        where
            T: MyFromStr,
        {
            T::my_from_str(self.read.next().unwrap().unwrap().trim())
        }

        // n is the amount of lines to be skipped.
        // This is slightly faster than calling next and throwing it away as the data
        // is not being copied into a temporary string.
        #[inline(always)]
        pub fn skip(&mut self, n: usize) {
            debug_assert!(n > 0);
            self.read.nth(n - 1);
        }

        // Executes the function f on the next n lines of stdin.
        // Useful for taking many lines input that need to be treated before stored.
        #[inline(always)]
        pub fn for_each_n<F, T>(&mut self, n: usize, mut f: F)
        where
            F: FnMut(T),
            T: MyFromStr,
        {
            for _ in 0..n {
                f(self.next());
            }
        }

        // Maps the next n lines into a collection.
        pub fn collect_n<F, T, C, R>(&mut self, n: usize, mut f: F) -> C
        where
            F: FnMut(T) -> R,
            T: MyFromStr,
            C: FromIterator<R>,
        {
            (0..n).map(|_| f(self.next())).collect()
        }
    }
}
