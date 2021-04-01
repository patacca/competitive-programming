#include <bits/stdc++.h>

using namespace std;

bool constexpr DEBUG {true};

void debug() { if constexpr(DEBUG) cerr << endl;}

template <typename T1, typename ...T>
void debug(T1&& head, T&&... args)
{
	if constexpr(DEBUG) {
		cerr << head << " ";
		debug(args ...);
	}
}

struct custom_hash {
	static uint64_t splitmix64(uint64_t x) {
		// http://xorshift.di.unimi.it/splitmix64.c
		x += 0x9e3779b97f4a7c15;
		x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
		x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
		return x ^ (x >> 31);
	}

	static int splitmix32(int x) {
		uint64_t z = x;
		return (splitmix64(z) & 0xffffffff);
	}

	uint64_t operator()(uint64_t x) const {
		static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
		return splitmix64(x + FIXED_RANDOM);
	}

	int operator()(int x) const {
		static const int FIXED_RANDOM = (chrono::steady_clock::now().time_since_epoch().count() & 0xffffffff);
		return splitmix32(x + FIXED_RANDOM);
	}
};

template <typename T>
inline T custom_ceil(T a, T b)
{
	return 1 + ((a - 1) / b);
}

template <typename T>
inline double log_b(T base, T x)
{
	return log(x)/log(base);
}

inline long double log_b(long double base, long double x)
{
	return log(x)/log(base);
}

template <typename T1, typename T2>
inline int perfect_log(T1 base, T2 x)
{
	int e = static_cast<int>(log_b(base, x));
	int best = {e};
	for (int k=-1; k < 2; ++k)
		if (pow(base, e+k) <= x)
			best = e+k;
	return best;
}

/* Fast inverse of a modulo p (p must be prime) */
template <typename T>
long long fast_inv(T a, T p) {
	long long res = 1;
	long long p2 {p-2};
	while (p2) {
		if (p2 % 2 == 0) {
			a = a * 1ll * a % p;
			p2 /= 2;
		} else {
			res = res * 1ll * a % p;
			p2--;
		}
	}
	return res;
}





// USER CODE

struct Test {
	public:
		long long n, k;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n >> t.k;
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	return s;
};

// Globals
int T;
vector<Test> tests;


void readInput()
{
	cin >> T;
	for (int k=0; k < T; ++k) {
		Test t;
		cin >> t;
		tests.push_back(move(t));
	}
}

void solve(Test& t)
{
	if (t.k == 3) {
		if (t.n == 4)
			cout << "1 1 2\n";
		else if (t.n == 8)
			cout << "4 2 2\n";
		else if (t.n % 2 == 1)
			cout << "1 " << (t.n-1)/2 << " " << (t.n-1)/2 << endl;
		else if (t.n % 4 == 2)
			cout << "2 " << t.n/2-1 << " " << t.n/2 - 1 << endl;
		else if ((t.n/2-2) % 4 == 0)
			cout << "4 " << (t.n/2-2) << " " << (t.n/2-2) << endl;
		else {
			// t.n is divisible by 4 and n/2 is divisible by 4
			int m{1};
			while (true) {
				t.n /= 4;
				m *= 4;
				if (t.n == 4) {
					cout << m << " " << m << " " << 2*m << endl;
					return;
				} else if (t.n == 8) {
					cout << 4*m << " " << 2*m << " " << 2*m << endl;
					return;
				} else if (t.n % 2 == 1) {
					cout << m << " " << m*((t.n-1)/2) << " " << m*((t.n-1)/2) << endl;
					return;
				} else if (t.n % 4 == 2) {
					cout << 2*m << " " << m*(t.n/2-1) << " " << m*(t.n/2 - 1) << endl;
					return;
				} else if ((t.n/2-2) % 4 == 0) {
					cout << 4*m << " " << m*(t.n/2-2) << " " << m*(t.n/2-2) << endl;
					return;
				}
			}
		}
		return;
	}
	
	long long r {t.n % t.k};
	long long q {t.n / t.k};
	if (r == 0) {
		for (int k=0; k < t.k; ++k)
			cout << q << " ";
		cout << endl;
		return;
	} else {
		long long r1 = (r + q) % (t.k-1);
		long long q1 = (t.n-r1) / (t.k-1);
		if (r1 != 0 && (q1*r1)/gcd(r1, q1) <= t.n/2) {
			cout << r1 << " ";
			for (int k=0; k < t.k-1; ++k)
				cout << q1 << " ";
			cout << endl;
			return;
		} else {
			cout << "1 ";
			--t.n;
			--t.k;
			solve(t);
		}
	}
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	ios_base::sync_with_stdio(false);
	cin.tie(0);
	
	readInput();
	
	// Solve each test
	for (auto& t : tests) {
		solve(t);
	}
	
	return 0;
}
