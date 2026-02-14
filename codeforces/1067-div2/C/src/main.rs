use std::{collections::HashMap, hash::Hash, i64, io};

fn solve_easy(a: Vec<i64>, b: Vec<i64>) {
    let mut s: i64 = 0;
    let mut best_s: i64 = i64::MIN;

    for i in 0..a.len() {
        s += a[i];
        best_s = std::cmp::max(best_s, s);
        if s < 0 {
            s = 0;
        }
    }
    println!("{}", best_s);
}

fn solve_hard(a: Vec<i64>, b: Vec<i64>) {
    let mut s: i64 = 0;
    let mut best_s: i64 = i64::MIN;
    let mut best_b: i64 = 0;
    let mut bbb: i64 = i64::MIN;

    for i in 0..a.len() {
        s += a[i];
        best_s = std::cmp::max(best_s, s);
        best_b = std::cmp::max(s + b[i], best_b + a[i]);
        if s < 0 {
            s = 0;
        }
        bbb = std::cmp::max(bbb, best_b);
        if best_b < 0 {
            best_b = 0;
        }
    }
    best_s = std::cmp::max(best_s, bbb);
    println!("{}", best_s);
}

fn main() {
    let mut buf = String::new();
    io::stdin().read_line(&mut buf).unwrap();
    let t: u32 = buf.trim().parse().unwrap();

    for _ in 0..t {
        buf.clear();
        io::stdin().read_line(&mut buf).unwrap();
        let v: Vec<u32> = buf
            .trim()
            .split_whitespace()
            .map(|s| s.parse::<u32>().unwrap())
            .collect();
        let (n, k) = (v[0], v[1]);
        buf.clear();
        io::stdin().read_line(&mut buf).unwrap();
        let mut a: Vec<i64> = buf
            .trim()
            .split_whitespace()
            .map(|s| s.parse().unwrap())
            .collect();
        buf.clear();
        io::stdin().read_line(&mut buf).unwrap();
        let mut b: Vec<i64> = buf
            .trim()
            .split_whitespace()
            .map(|s| s.parse().unwrap())
            .collect();

        if k % 2 == 0 {
            solve_easy(a, b);
        } else {
            solve_hard(a, b);
        }
    }
}
