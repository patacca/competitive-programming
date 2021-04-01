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
		int n, m;
		vector<int> a, b;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n >> t.m;
	
	t.a.resize(t.n);
	t.b.resize(t.m);
	for (int k =0; k < t.n; ++k)
		s >> t.a[k];
	for (int k =0; k < t.m; ++k)
		s >> t.b[k];
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

int findBest(int start, int end, int size, vector<int>::iterator b, vector<int>::iterator endI)
{
	int best{0}, curr{0};
	deque<int> pos;
	while (b != endI && *b >= start && *b < end && curr < size) {
		while (pos.size() > 0 && *b - pos.front() + 1 > size) {
			pos.pop_front();
			--curr;
		}
		pos.push_back(*b);
		++curr;
		best = max(best, curr);
		//~ debug(start, end, *b, best);
		++b;
	}
	
	//~ debug("best inside", best);
	
	return best;
}

void oldSolve(Test& t)
{
	vector<int> a, b;
	for (auto x : t.a)
		if (x > 0)
			a.push_back(x);
	for (auto x : t.b)
		if (x > 0)
			b.push_back(x);
	
	int idxB{0};
	vector<int> already;
	for (int idxA=0; idxA < a.size(); ++idxA) {
		while (idxB < b.size() && a[idxA] > b[idxB])
			++idxB;
		if (idxB < b.size() && a[idxA] == b[idxB])
			already.push_back(1);
		else
			already.push_back(0);
	}
	int partial{0};
	for (int k=already.size()-1; k >= 0; --k) {
		partial += already[k];
		already[k] = partial;
	}
	
	int start, end, s{0};
	int best{(a.size() > 0 ? already[0] : 0)};
	auto it = b.begin();
	for (int k = 1; k < a.size()+1; ++k) {
		start = a[k-1] - s;
		if (k == a.size())
			end = 1e9+1;
		else
			end = a[k];
		while (it != b.begin() && *it >= start) {
			--it;
		}
		while (it != b.end() && *it < start) {
			++it;
		}
		if (k == a.size())
			best = max(best, findBest(start, end, s+1, it, b.end()));
		else
			best = max(best, findBest(start, end, s+1, it, b.end()) + already[k]);
		++s;
	}
	
	a.clear();
	b.clear();
	for (auto x : t.a)
		if (x < 0)
			a.push_back(-x);
	for (auto x : t.b)
		if (x < 0)
			b.push_back(-x);
	
	reverse(a.begin(), a.end());
	reverse(b.begin(), b.end());
	
	idxB = 0;
	already.clear();
	for (int idxA=0; idxA < a.size(); ++idxA) {
		while (idxB < b.size() && a[idxA] > b[idxB])
			++idxB;
		if (idxB < b.size() && a[idxA] == b[idxB])
			already.push_back(1);
		else
			already.push_back(0);
	}
	partial = 0;
	for (int k=already.size()-1; k >= 0; --k) {
		partial += already[k];
		already[k] = partial;
	}
	
	s = 0;
	int best2{(a.size() > 0 ? already[0] : 0)};
	it = b.begin();
	for (int k = 1; k < a.size()+1; ++k) {
		//~ debug("pos", a[k-1], s);
		start = a[k-1] - s;
		if (k == a.size())
			end = 1e9+1;
		else
			end = a[k];
		while (it != b.begin() && *it >= start) {
			--it;
		}
		while (it != b.end() && *it < start) {
			++it;
		}
		if (k == a.size())
			best2 = max(best2, findBest(start, end, s+1, it, b.end()));
		else
			best2 = max(best2, findBest(start, end, s+1, it, b.end()) + already[k]);
		++s;
	}
	
	cout << best+best2 << endl;
}

int sol(vector<int>& a, vector<int>& b)
{
	int n {(int)a.size()};
	int m {(int)b.size()};
	
	vector<int> suf(n+1, 0);
	int j{m-1};
	for (int k=n-1; k >= 0; --k) {
		suf[k] = suf[k+1];
		while (j >= 0 && b[j] > a[k])
			--j;
		if (j >=0 && b[j] == a[k])
			++suf[k];
	}
	
	int ans {suf[0]};
	j = 0;
	int p{0};
	for (int k=0; k < m; ++k) {
		// Try to move j boxes to special position k and see if we have a better answer
		while (j < n && a[j] <= b[k] + j)
			++j;
		while (p < m && b[p] < b[k] + j)
			++p;
		ans = max(ans, p-k + suf[j]);
	}
	
	return ans;
}

void solve(Test& t)
{
	vector<int> al, ar, bl, br;
	for (auto& x : t.a)
		if (x < 0)
			al.push_back(-x);
		else
			ar.push_back(x);
	for (auto& x : t.b)
		if (x < 0)
			bl.push_back(-x);
		else
			br.push_back(x);
	
	sort(al.begin(), al.end());
	sort(ar.begin(), ar.end());
	sort(bl.begin(), bl.end());
	sort(br.begin(), br.end());
	
	cout << sol(al, bl) + sol(ar, br) << endl;
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
