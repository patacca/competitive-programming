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




// USER CODE

struct Test {
	public:
		int n, q, k;
		vector<int> a;
		vector<pair<int,int>> queries;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n >> t.q >> t.k;
	t.a.resize(t.n);
	t.queries.resize(t.q);
	for (int k=0; k < t.n; ++k)
		s >> t.a[k];
	for (int k=0; k < t.q; ++k)
		s >> t.queries[k].first >> t.queries[k].second;
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
	Test t;
	cin >> t;
	tests.push_back(move(t));
}

void solve(Test& t)
{
	vector<pair<int,int>> h;
	
	if (t.n == 1) {
		for (auto& q : t.queries)
			cout << t.k-1 << endl;
		return;
	}
	
	h.push_back({1, t.a[1]-1});
	for (int k=1; k < t.n-1; ++k)
		h.push_back({t.a[k-1]+1, t.a[k+1]-1});
	
	h.push_back({t.a[t.n-2]+1, t.k});
	
	vector<long long> presum;
	long long s{0};
	for (auto& x : h) {
		s += x.second - x.first;
		presum.push_back(s);
	}
	
	//~ for (auto& x : h)
		//~ debug(x.first, x.second);
	
	for (auto& q : t.queries) {
		if (q.second - q.first > 0)
			cout << presum[q.second-1] - (q.first >= 2 ? presum[q.first-2] : 0) + (h[q.first-1].first - 1) + (t.k - h[q.second-1].second) << endl;
		else
			cout << t.k - 1 << endl;
		//~ int ans {h[q.first-1].second-1};
		//~ debug(ans);
		//~ for (int k=q.first; k < q.second-1; ++k) {
			//~ ans += h[k].second - h[k].first;
			//~ debug(ans);
		//~ }
		//~ ans += t.k - h[q.second-1].first;
		//~ debug(ans);
		
		//~ cout << ans << endl;
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
