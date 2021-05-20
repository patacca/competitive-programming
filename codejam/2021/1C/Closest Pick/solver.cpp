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
		int n;
		long long k;
		vector<long long> p;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n >> t.k;
	t.p.resize(t.n);
	for (int k=0; k < t.n; ++k)
		s >> t.p[k];
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

void solve(Test& t, int tc)
{
	sort(t.p.begin(), t.p.end());
	vector<pair<long long, long long>> d;
	d.push_back({t.p[0] - 1, 0});
	for (int k = 0; k < t.n-1; ++k) {
		if (t.p[k+1] == t.p[k])
			d.push_back({0, 0});
		else
			d.push_back({custom_ceil(t.p[k+1] - t.p[k] - 1, 2LL), (t.p[k+1] - t.p[k] - 1)/2LL});
	}
	d.push_back({t.k - t.p[t.n-1], 0});
	
	sort(d.rbegin(), d.rend());
	long double prob;
	prob = d[0].first;
	if (d[1].first > d[0].second)
		prob += d[1].first;
	else
		prob += d[0].second;
	prob /= t.k;
	
	cout << "Case #" << tc << ": " << setprecision(25) << prob << endl;
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
