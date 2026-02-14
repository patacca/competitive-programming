use std::{collections::HashMap, hash::Hash, io};

fn solve(v: HashMap<u32, u32>) {
    let mut odds: u64 = 0;
    let mut p2: u64 = 0;
    let mut p4: u64 = 0;
    for (k, val) in v.iter() {
        if val % 2 == 1 {
            odds += 1;
        } else if val % 4 != 0 {
            p2 += 1;
        } else {
            p4 += 1;
        }
    }
    println!(
        "{}",
        odds + 2 * p2 + 4 * (p4 / 2) + 2 * ((p4 % 2) * ((odds > 0) as u64))
    );
}

fn main() {
    let mut buf = String::new();
    io::stdin().read_line(&mut buf).unwrap();
    let t: u32 = buf.trim().parse().unwrap();

    for _ in 0..t {
        buf.clear();
        io::stdin().read_line(&mut buf).unwrap();
        let n: u32 = buf.trim().parse().unwrap();
        buf.clear();
        io::stdin().read_line(&mut buf).unwrap();
        let mut v: HashMap<u32, u32> = HashMap::new();
        buf.trim()
            .split_whitespace()
            .for_each(|s| *v.entry(s.parse::<u32>().unwrap()).or_insert(0) += 1);

        solve(v);
    }
}
