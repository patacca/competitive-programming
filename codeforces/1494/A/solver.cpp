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
		string a;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.a;
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
	map<char, char> mapping;
	set<char> free {'A', 'B', 'C'};
	mapping['A'] = '(';
	mapping['B'] = '(';
	mapping['C'] = '(';
	
	char ch {t.a[0]};
	
	mapping[ch] = '(';
	free.erase(ch);
	
	
	for (int rep=0; rep < 4; ++rep) {
		string s;
		s = t.a;
		for (int k=0; k < s.size(); ++k)
			if (s[k] == ch)
				s[k] = '(';
		
		char ch1, ch2;
		vector<char> p;
		p.clear();
		switch (rep) {
		case 0:
			ch1 = '(';
			ch2 = '(';
			break;
		case 1:
			ch1 = '(';
			ch2 = ')';
			break;
		case 2:
			ch1 = ')';
			ch2 = '(';
			break;
		case 3:
			ch1 = ')';
			ch2 = ')';
			break;
		}
		for (auto& x : free)
			p.push_back(x);
		
		for (int k=0; k < s.size(); ++k) {
			if (s[k] == p[0])
				s[k] = ch1;
			else if (s[k] == p[1])
				s[k] = ch2;
		}
		
		int open{0};
		bool ok;
		for (int k=0; k < s.size(); ++k) {
			if (s[k] == '(')
				++open;
			else
				--open;
			if (open < 0)
				break;
		}
		if (open == 0) {
			cout << "YES\n";
			return;
		}
	}
	
	cout << "NO\n";
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
