use std::io;

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
        let (l, r) = buf.trim().split_once(' ').unwrap();
        let y: u32 = l.parse().unwrap();
        let r: u32 = r.parse().unwrap();
        println!("{}", std::cmp::min(y / 2 + r, n));
    }
}
