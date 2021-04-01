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
		int n;
		vector<int> a;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n;
	t.a.resize(t.n);
	for (int k=0; k < t.n; ++k)
		s >> t.a[k];
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
	vector<pair<int,int>> c;
	for (int k=0; k < t.n; ++k) {
		if (t.a[k]) {
			int pn = min(t.a[k], k+1);
			// [0, n-1]
			// [k - (pn-1), k]
			int s {k-pn+1};
			int e {k};
			int j{((int)c.size())-1};
			while (j >= 0 && c[j].first > s) {
				--j;
				c.pop_back();
			}
			if (j < 0) {
				c.push_back({s, e});
			} else if (c[j].second >= s) {
				// [c[j].first, e]
				int tmp {c[j].first};
				c.pop_back();
				c.push_back({tmp, e});
			} else {
				// add [s, e]
				c.push_back({s, e});
			}
		}
	}
	
	//~ for (auto& x : c)
		//~ debug(x.first, x.second);
	
	int l {0};
	for (int k=0; k < c.size(); ++k) {
		for (int j=l; j < c[k].first; ++j)
			cout << "0 ";
		for (int j=c[k].first; j <= c[k].second; ++j)
			cout << "1 ";
		l = c[k].second + 1;
	}
	while (l < t.n) {
		cout << "0 ";
		++l;
	}
	cout << endl;
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
