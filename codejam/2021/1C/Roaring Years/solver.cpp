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
	return (a == 0 ? 0 : 1 + ((a - 1) / b));
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
		__int128 n;
};

istream& operator>>(istream& s, Test& t) {
	long long tmp;
	s >> tmp;
	t.n = tmp;
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	return s;
};

// Globals
int T;
vector<Test> tests;
vector<__int128> possible;
vector<__int128> tpow = {1, 10, 100, 1'000, 10'000, 100'000, 1'000'000, 10'000'000, 100'000'000, 1'000'000'000, 10'000'000'000, 100'000'000'000, 1'000'000'000'000, 10'000'000'000'000, 100'000'000'000'000, 1'000'000'000'000'000, 10'000'000'000'000'000, 100'000'000'000'000'000, 1'000'000'000'000'000'000, LONG_MAX};


void readInput()
{
	cin >> T;
	for (int k=0; k < T; ++k) {
		Test t;
		cin >> t;
		tests.push_back(move(t));
	}
}

void checkIfRoaring(__int128 n, int d, int b, int f, bool flag)
{
	__int128 nmin, nmax;
	
	nmin = max(n+1, (n/tpow[f])*tpow[f]);
	if (flag)
		nmax = tpow[f+1]-1;
	else
		nmax = (1 + n/tpow[f])*tpow[f] - 1;
	
	//~ debug("minmax", f, nmin, nmax);
	
	if (d-f >= b) {
		__int128 newN;
		__int128 s {n/tpow[d-b]};
		__int128 r = n % tpow[d-b];
		int dr = d-b;
		//~ debug("starting", b, s, r);
		int dnn {b};
		newN = s;
		while (dnn < d) {
			++s;
			//~ debug("s", s);
			assert(b < 20);
			if (s >= tpow[b])
				++b;
			newN = tpow[b]*newN + s;
			dnn += b;
		}
		//~ debug("new N", newN, dnn);
		if (newN >= nmin && newN <= nmax)
			possible.push_back(newN);
	} else {
		__int128 s {n/tpow[d-b]};
		__int128 end {(1 + n/tpow[f])*tpow[b-d+f] - 1};
		//~ debug("starting", s, end, b, f);
		int oldB = b;
		for (__int128 k = s; k <= end; ++k) {
			b = oldB;
			__int128 tmp = k;
			__int128 newN = tmp;
			int dnn {b};
			while (dnn < d) {
				++tmp;
				assert(b < 20);
				if (tmp >= tpow[b])
					++b;
				newN = tpow[b]*newN + tmp;
				dnn += b;
			}
			if (newN >= nmin && newN <= nmax) {
				possible.push_back(newN);
				return;
			}
		}
	}
}

void solve(Test& t, int tc)
{
	possible.clear();
	int d {1};
	__int128 b = 10;
	for (int k=0; k < 18; ++k) {
		if (b > t.n)
			break;
		++d;
		b *= 10;
	}
	assert(d <= 19);
	//~ debug("begin", t.n, d);
	
	for (int f = 1; f <= d; ++f) {
		for (int b = 1; b <= d/2; ++b) {
			checkIfRoaring(t.n, d, b, f, false);
		}
		if (possible.size() > 0) {
			// Got a solution
			sort(possible.begin(), possible.end());
			cout << "Case #" << tc << ": ";
			cout << (long long) (possible[0]/tpow[18]);
			cout << (long long) (possible[0]%tpow[18]);
			cout << endl;
			return;
		}
	}
	
	// IF NO SOLUTION THEN FIND NEXT ROARING YEAR THAT HAS THE FIRST DIGIT DIFFERENT OR HAS MORE THAN d DIGITS
	while (d <= 18) {
		d = d+1;
		__int128 n = tpow[d];
		int f = d;
		for (int b = 1; b <= d/2; ++b) {
			//~ debug("checkIfRoaring", n, d, b, f);
			checkIfRoaring(n, d, b, f, false);
		}
		if (possible.size() > 0) {
			// Got a solution
			sort(possible.begin(), possible.end());
			cout << "Case #" << tc << ": ";
			cout << (long long) (possible[0]/tpow[18]);
			cout << (long long) (possible[0]%tpow[18]);
			cout << endl;
			return;
		}
	}
	
	assert(false);
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	ios_base::sync_with_stdio(false);
	cin.tie(0);
	
	readInput();
	int tc{1};
	// Solve each test
	for (auto& t : tests) {
		solve(t, tc);
		++tc;
	}
	
	return 0;
}
