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
		vector<long long> c;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n;
	t.c.resize(t.n);
	for (int k=0; k < t.n; ++k)
		s >> t.c[k];
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
	vector<long long> dp(t.n, 0);
	dp[0] = t.c[0]*t.n; // incomplete, can't reach (n, n)
	dp[1] = t.c[1]*t.n + dp[0];
	
	vector<pair<long long, int>> m(2);
	m[0] = {t.c[0], t.n};
	m[1] = {t.c[1], t.n};
	
	for (int k=2; k < t.n; ++k) {
		int p {k%2};
		if (m[p].first > t.c[k]) {
			dp[k] = dp[k-1] + (t.c[k] * (m[p].second-1)) - (m[p].first * (m[p].second-1));
			m[p] = {t.c[k], m[p].second-1};
		} else {
			--m[p].second;
			dp[k] = dp[k-1] + (t.c[k]) - (m[p].first);
		}
	}
	
	//~ long long sol {LLONG_MAX};
	//~ for (int k=1; k < t.n; ++k) {
		//~ sol = min(sol, dp[k]);
		//~ debug("dp", k, dp[k]);
	//~ }
	//~ cout << sol << endl;
	
	cout << *(min_element(dp.begin()+1, dp.end())) << endl;
	
	//~ vector<pair<long long, int>> m(2);
	
	//~ vector<int> mi{0,1};
	//~ m[0] = {t.c[0], t.n};
	//~ m[1] = {t.c[1], t.n};
	//~ int lastIndx {1};
	
	//~ vector<long long> prefix(t.n);
	//~ long long last{0};
	//~ for (int k=0; k < t.n; ++k) {
		//~ last += t.c[k];
		//~ prefix[k] = last;
	//~ }
	
	//~ for (int k=2; k < t.n; ++k) {
		//~ int p {k%2};
		//~ if (m[p].first > t.c[k]) {
			//~ if (k == lastIndx+1) {
				//~ m[p] = {t.c[k], m[p].second-1};
				//~ lastIndx = k;
				//~ mi[p] = k;
			//~ } else {
				//~ // check if it's worth it
				//~ int np, nd;
				//~ int interval {k-lastIndx-1};
				//~ int firstIsOdd = (lastIndx+1)%2;
				//~ if (firstIsOdd) {
					//~ nd = custom_ceil(interval, 2);
					//~ np = interval/2;
				//~ } else {
					//~ np = custom_ceil(interval, 2);
					//~ nd = interval/2;
				//~ }
				
				//~ // np even indexes
				//~ // nd odd indexes;
				//~ assert(nd < m[1].second);
				//~ assert(np < m[0].second);
				
				//~ long long left = (m[p].first - t.c[k]) * (m[p].second-1-np);
				//~ long long right = -m[1].first*nd - m[0].first*np;
				//~ right += (prefix[k-1] - prefix[lastIndx]);
				//~ if (left > right) {
					//~ m[p] = {t.c[k], m[p].second-1-np};
					//~ lastIndx = k;
					//~ mi[p] = k;
				//~ }
			//~ }
		//~ }
	//~ }
	
	//~ long long sol {0};
	//~ for (int k=0; k <= lastIndx; ++k) {
		//~ if (mi[0] == k)
			//~ sol += m[0].second*t.c[k];
		//~ else if (mi[1] == k)
			//~ sol += m[1].second*t.c[k];
		//~ else
			//~ sol += t.c[k];
	//~ }
	//~ cout << sol << endl;
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
