#include <bits/stdc++.h>

using namespace std;

bool constexpr DEBUG {false};

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
		vector<pair<long long, long long>> p;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n;
	t.p.resize(t.n);
	for (int k=0; k < t.n; ++k)
		s >> t.p[k].first >> t.p[k].second;
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
	vector<tuple<long long, long long, int>> p;
	for (int k = 0; k < t.n; ++k)
		p.push_back({t.p[k].first, t.p[k].second, k});
	
	sort(p.begin(), p.end());
	
	vector<pair<long long, int>> prefix(t.n);
	pair<long long, int> last = {LONG_LONG_MAX, -1};
	for (int k=0; k < t.n; ++k) {
		if (last.first > get<1>(p[k])) {
			last.first = get<1>(p[k]);
			last.second = get<2>(p[k]);
		}
		prefix[k] = last;
	}
	
	for (auto& x : p)
		debug(get<0>(x), get<1>(x), get<2>(x));
	
	vector<int> sol(t.n);
	int lastIdx {0};
	for (int k=0; k < t.n; ++k) {
		if (k > 0 && get<0>(p[k-1]) != get<0>(p[k]))
			lastIdx = k-1;
		if (k > 0 && prefix[lastIdx].first < get<1>(p[k]) && get<0>(p[lastIdx]) < get<0>(p[k]))
			sol[get<2>(p[k])] = prefix[lastIdx].second + 1;
		else {
			// Flip it and search
			long long h {get<1>(p[k])};
			long long w {get<0>(p[k])};
			debug("flip ", k, h, w);
			//~ auto it = upper_bound(p.begin(), p.end(), h, [&] (auto& val, auto& b) { return val > get<0>(b); });
			auto it = lower_bound(p.begin(), p.end(), h, [&] (auto& b, auto& val) { return val > get<0>(b); });
			if (it != p.begin())
				--it;
			else {
				debug("none -");
				sol[get<2>(p[k])] = -1;
				continue;
			}
			if (prefix[it-p.begin()].first < w) {
			//~ if (it != p.end() && prefix[it-p.begin()].first < w) {
				sol[get<2>(p[k])] = prefix[it-p.begin()].second + 1;
				debug(prefix[it-p.begin()].second);
			} else {
				//~ if (it == p.end())
					//~ debug("none -");
				//~ else
					//~ debug("none", get<0>(*it), get<1>(*it), get<2>(*it));
				debug("none", get<0>(*it), get<1>(*it), get<2>(*it));
				sol[get<2>(p[k])] = -1;
			}
		}
	}
	
	for (auto& x : sol)
		cout << x << " ";
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
